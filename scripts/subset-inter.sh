#!/usr/bin/env bash
#
# Regenerates the self-hosted Inter subsets in src/fonts/.
#
# Why this exists instead of @fontsource-variable/inter: fontsource's woff2
# subsets are built with the layout features stripped, so every character
# variant is gone (verified: only calt ccmp dnom frac kern locl mark mkmk numr
# pnum tnum survive). The site's type identity depends on cv11 — Inter's
# single-storey `a` — so the font is subset here instead, from the upstream
# release, keeping the features we actually use.
#
# The opsz axis is deliberately pinned out: keeping it roughly doubles the
# variation deltas (+29KB on the latin subset) to buy optical sizing we do not
# currently drive. Weight stays variable across the full 100-900 range.
#
# Metrics are unchanged from upstream (unitsPerEm 2048, ascender 1984,
# descender -494), which is what makes the "Inter Fallback" size-adjust
# overrides in src/css/global.css valid. Re-check those if this ever moves to a
# font whose metrics differ.
#
# Requires: curl, python3, and
#   python3 -m pip install fonttools brotli opentype-feature-freezer
# Run from the repo root: ./scripts/subset-inter.sh
#
set -euo pipefail

VERSION="4.1"
OUT="src/fonts"
# The OG render font is server-read by takumi (src/pages/blog/_cmp/takumi.ts),
# not bundled by Vite, so it lives under public/ like the PDF render fonts.
OG_OUT="public/fonts/og"
# The CV render fonts sit beside the other @react-pdf font binaries, which is
# where pdf-utils.ts resolves them from.
CV_OUT="public/fonts/pdf"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# Google Fonts' standard subset boundaries, so the unicode-range split in
# global.css matches what the rest of the web expects.
LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
LATIN_EXT="U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"

# Greek, Cyrillic and Vietnamese are intentionally not shipped: no content uses
# them, and text that does (a Cyrillic name in the live activity feed) falls
# through unicode-range to the fallback stack rather than costing every visitor
# bytes they will never render.

# cv11 is the one the design depends on. The rest are kept because they cost
# ~6KB together and cover the numeral and punctuation cases: ss08 round quotes,
# zero slashed zero for data, cv05 tailed l, tnum/frac for figures.
FEATURES="cv01,cv02,cv03,cv04,cv05,cv06,cv07,cv08,cv09,cv10,cv11,cv12,cv13,cv14,ss01,ss02,ss03,ss04,ss08,zero,case,cpsp,salt,dlig,tnum,frac"

echo "Downloading Inter $VERSION..."
curl -fsSL -o "$WORK/inter.zip" \
	"https://github.com/rsms/inter/releases/download/v$VERSION/Inter-$VERSION.zip"

python3 - "$WORK" <<'PY'
import sys, zipfile
work = sys.argv[1]
with zipfile.ZipFile(f"{work}/inter.zip") as z:
	for name in ("web/InterVariable.woff2", "web/InterVariable-Italic.woff2"):
		open(f"{work}/{name.split('/')[-1]}", "wb").write(z.read(name))
PY

mkdir -p "$OUT"

for style in normal italic; do
	case "$style" in
	normal) src="InterVariable.woff2" ;;
	italic) src="InterVariable-Italic.woff2" ;;
	esac

	# Pin opsz to its default so the axis stops contributing deltas.
	python3 -m fontTools.varLib.instancer \
		"$WORK/$src" opsz=14 --output="$WORK/pinned-$style.ttf" >/dev/null

	for subset in latin latin-ext; do
		case "$subset" in
		latin) ranges="$LATIN" ;;
		latin-ext) ranges="$LATIN_EXT" ;;
		esac

		python3 -m fontTools.subset "$WORK/pinned-$style.ttf" \
			--output-file="$OUT/inter-$subset-$style.woff2" \
			--flavor=woff2 \
			--unicodes="$ranges" \
			--layout-features+="$FEATURES" \
			--drop-tables+=DSIG
	done
done

# The OG render font. takumi (the social-card renderer) cannot apply OpenType
# features at render time, so cv11 and ss08 — the single-storey `a` and round
# quotes that make the site's lettering its own — are frozen into the default
# glyphs here with pyftfeatfreeze. Without this the cards would show stock
# double-storey Inter and contradict the site they link to. Roman only: Inter's
# true italic already draws a single-storey `a`, and the cards use upright text.
mkdir -p "$OG_OUT"
pyftfeatfreeze -f "cv11,ss08" "$WORK/pinned-normal.ttf" "$WORK/frozen.ttf" >/dev/null
python3 -m fontTools.subset "$WORK/frozen.ttf" \
	--output-file="$OG_OUT/inter-og.woff2" \
	--flavor=woff2 \
	--unicodes="$LATIN,$LATIN_EXT" \
	--drop-tables+=DSIG

# The CV render fonts. @react-pdf/renderer resolves a family to one file per
# weight/style rather than driving an axis, so these are static instances, and
# they are TTF because that is what its fontkit build reads reliably.
#
# The four faces mirror the Montserrat set they replace, one for one, so the
# existing weight resolution in pdf-utils.ts keeps landing where it used to.
# Features are frozen for the same reason as the OG font: react-pdf is not
# asked to apply them at render time.
#
# Each instance is renamed. Instancing leaves every cut called "Inter
# Variable", and the PDF writer keys embedded fonts by PostScript name — so
# identical names silently collapse all three weights into whichever loaded
# first, and the CV renders with no bold at all.
rename_face() {
	python3 - "$1" "$2" "$3" <<'PY'
import sys
from fontTools.ttLib import TTFont

path, family, subfamily = sys.argv[1], sys.argv[2], sys.argv[3]
font = TTFont(path)
name = font["name"]
full = family if subfamily == "Regular" else f"{family} {subfamily}"
postscript = full.replace(" ", "-")
for platform, encoding, language in ((3, 1, 0x409), (1, 0, 0)):
	name.setName(family, 1, platform, encoding, language)
	name.setName(subfamily, 2, platform, encoding, language)
	name.setName(full, 4, platform, encoding, language)
	name.setName(postscript, 6, platform, encoding, language)
# Typographic names would re-group the cuts under one family downstream.
for name_id in (16, 17):
	name.removeNames(name_id)
font.save(path)
PY
}

mkdir -p "$CV_OUT"
for face in "Light:300" "Regular:400" "SemiBold:600"; do
	name="${face%%:*}"
	weight="${face##*:}"
	python3 -m fontTools.varLib.instancer "$WORK/pinned-normal.ttf" \
		"wght=$weight" --output="$WORK/cv-$name.ttf" >/dev/null
	pyftfeatfreeze -f "cv11,ss08" "$WORK/cv-$name.ttf" \
		"$WORK/cv-$name-frozen.ttf" >/dev/null
	python3 -m fontTools.subset "$WORK/cv-$name-frozen.ttf" \
		--output-file="$CV_OUT/Inter-$name.ttf" \
		--unicodes="$LATIN,$LATIN_EXT" \
		--drop-tables+=DSIG
	case "$name" in
	Regular) rename_face "$CV_OUT/Inter-$name.ttf" "Inter" "Regular" ;;
	*) rename_face "$CV_OUT/Inter-$name.ttf" "Inter $name" "Regular" ;;
	esac
done

# Italic freezes ss08 only: upstream ships no cv11 for the italic, whose `a` is
# already single-storey by design.
python3 -m fontTools.varLib.instancer "$WORK/pinned-italic.ttf" \
	"wght=400" --output="$WORK/cv-Italic.ttf" >/dev/null
pyftfeatfreeze -f "ss08" "$WORK/cv-Italic.ttf" "$WORK/cv-Italic-frozen.ttf" >/dev/null
python3 -m fontTools.subset "$WORK/cv-Italic-frozen.ttf" \
	--output-file="$CV_OUT/Inter-Italic.ttf" \
	--unicodes="$LATIN,$LATIN_EXT" \
	--drop-tables+=DSIG
rename_face "$CV_OUT/Inter-Italic.ttf" "Inter" "Italic"

echo
echo "Wrote:"
ls -l "$OUT"/*.woff2 "$OG_OUT"/*.woff2 "$CV_OUT"/Inter-*.ttf |
	awk '{printf "  %-44s %6.1f KB\n", $NF, $5/1024}'
