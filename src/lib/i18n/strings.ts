/**
 * UI strings. English is the source; every key must exist in every language,
 * which the `satisfies` checks below enforce.
 */
const en = {
	"nav.blog": "Blog",
	"nav.projects": "Projects",
	"nav.activity": "Activity",
	"nav.uses": "Uses",
	"nav.now": "Now",

	"footer.site": "Site",
	"footer.elsewhere": "Elsewhere",
	"footer.thisSite": "This site",
	"footer.blogFeed": "Blog feed",
	"footer.blogFeedEnglish": "Blog feed (English)",
	"footer.activityFeed": "Activity feed",
	"footer.source": "Source",
	"footer.writingLicense": "Writing under CC BY-NC 4.0",
	"footer.codeLicense": "Code under MIT",
	"footer.language": "Language",

	"home.recentActivity": "Recent activity",
	"home.allActivity": "All activity",
	"home.activity": "Activity",
	"home.recentPosts": "Recent posts",
	"home.allPosts": "All posts",
	"home.selectedProjects": "Selected projects",
	"home.allProjects": "All projects",
	"home.skills": "Skills",

	"blog.title": "Blog",
	"blog.intro":
		"Notes on building software, infrastructure and the web, going back to 2019.",

	"post.showDescription": "Show description",
};

export type StringKey = keyof typeof en;

const da = {
	"nav.blog": "Blog",
	"nav.projects": "Projekter",
	"nav.activity": "Aktivitet",
	"nav.uses": "Værktøjer",
	"nav.now": "Nu",

	"footer.site": "Sider",
	"footer.elsewhere": "Andre steder",
	"footer.thisSite": "Om siden",
	"footer.blogFeed": "Blog-feed (dansk)",
	"footer.blogFeedEnglish": "Blog-feed (engelsk)",
	"footer.activityFeed": "Aktivitetsfeed",
	"footer.source": "Kildekode",
	"footer.writingLicense": "Tekst under CC BY-NC 4.0",
	"footer.codeLicense": "Kode under MIT",
	"footer.language": "Sprog",

	"home.recentActivity": "Seneste aktivitet",
	"home.allActivity": "Al aktivitet",
	"home.activity": "Aktivitet",
	"home.recentPosts": "Seneste indlæg",
	"home.allPosts": "Alle indlæg",
	"home.selectedProjects": "Udvalgte projekter",
	"home.allProjects": "Alle projekter",
	"home.skills": "Kompetencer",

	"blog.title": "Blog",
	"blog.intro":
		"Noter om at bygge software, infrastruktur og web, helt tilbage fra 2019.",

	"post.showDescription": "Vis beskrivelse",
} satisfies Record<StringKey, string>;

const is = {
	"nav.blog": "Blogg",
	"nav.projects": "Verkefni",
	"nav.activity": "Virkni",
	"nav.uses": "Verkfæri",
	"nav.now": "Núna",

	"footer.site": "Vefurinn",
	"footer.elsewhere": "Annars staðar",
	"footer.thisSite": "Um vefinn",
	"footer.blogFeed": "Bloggstraumur (íslenska)",
	"footer.blogFeedEnglish": "Bloggstraumur (enska)",
	"footer.activityFeed": "Virknistraumur",
	"footer.source": "Frumkóði",
	"footer.writingLicense": "Texti undir CC BY-NC 4.0",
	"footer.codeLicense": "Kóði undir MIT",
	"footer.language": "Tungumál",

	"home.recentActivity": "Nýleg virkni",
	"home.allActivity": "Öll virkni",
	"home.activity": "Virkni",
	"home.recentPosts": "Nýlegar færslur",
	"home.allPosts": "Allar færslur",
	"home.selectedProjects": "Valin verkefni",
	"home.allProjects": "Öll verkefni",
	"home.skills": "Hæfni",

	"blog.title": "Blogg",
	"blog.intro":
		"Pælingar um hugbúnaðargerð, innviði og vefinn, allt frá 2019.",

	"post.showDescription": "Sýna lýsingu",
} satisfies Record<StringKey, string>;

export const STRINGS = { en, da, is };
