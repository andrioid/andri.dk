export type ParsedCommand = {
	command: string;
	args: string[];
	flags: Record<string, true>;
	/** The original raw input string */
	raw: string;
};

/**
 * Parse a shell-like input string into structured command data.
 * Supports short flags (-rf expands to -r -f) and long flags (--force).
 * Does not support flag values (--flag=value) — all flags are boolean.
 */
export function parseCommand(input: string): ParsedCommand {
	const raw = input.trim();
	const tokens = raw.split(/\s+/).filter(Boolean);

	const command = tokens[0] ?? "";
	const args: string[] = [];
	const flags: Record<string, true> = {};

	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.startsWith("--")) {
			// Long flag: --force
			const name = token.slice(2);
			if (name) flags[name] = true;
		} else if (token.startsWith("-") && token.length > 1) {
			// Short flags: -rf expands to -r -f
			for (const char of token.slice(1)) {
				flags[char] = true;
			}
		} else {
			args.push(token);
		}
	}

	return { command, args, flags, raw };
}
