import type { Terminal } from "@xterm/xterm";
import terminalPrompt from "./terminal-prompt.txt?raw";

const PROMPT = "$ ";

function handleCommand(
	terminal: Terminal,
	command: string,
	onExit: () => void,
) {
	if (!command) return;

	switch (command) {
		case "hello":
			terminal.writeln("Hello! Welcome to my corner of the internet.");
			terminal.writeln(
				"I'm Andri \u2014 a software developer based in Aalborg, Denmark.",
			);
			break;
		case "exit":
			onExit();
			return;
		case "clear":
			terminal.clear();
			break;
		default:
			terminal.writeln(`Syntax Error`);
	}
}

export async function createTerminal(
	container: HTMLElement,
	onExit: () => void,
) {
	const [{ Terminal }, { FitAddon }] = await Promise.all([
		import("@xterm/xterm"),
		import("@xterm/addon-fit"),
	]);
	await import("@xterm/xterm/css/xterm.css");

	const terminal = new Terminal({
		cursorBlink: true,
		fontSize: 14,
		fontFamily: '"Source Code Pro Variable", monospace',
		convertEol: true,
		theme: {
			background: "#04080e",
			foreground: "#59b4ff",
			cursor: "#59b4ff",
			cursorAccent: "#04080e",
			selectionBackground: "rgba(89, 180, 255, 0.25)",
		},
	});

	const fitAddon = new FitAddon();
	terminal.loadAddon(fitAddon);
	terminal.open(container);
	fitAddon.fit();
	terminal.focus();

	terminal.writeln(terminalPrompt);
	terminal.write("\n");
	terminal.writeln("Software Developer & Systems Engineer\n");

	terminal.write(PROMPT);

	let currentLine = "";

	const dataDisposable = terminal.onData((data) => {
		switch (data) {
			case "\r": {
				terminal.writeln("");
				handleCommand(terminal, currentLine.trim(), onExit);
				currentLine = "";
				terminal.write(PROMPT);
				break;
			}
			case "\x7f": {
				if (currentLine.length > 0) {
					currentLine = currentLine.slice(0, -1);
					terminal.write("\b \b");
				}
				break;
			}
			case "\x03": {
				terminal.writeln("^C");
				currentLine = "";
				terminal.write(PROMPT);
				break;
			}
			default: {
				if (data >= String.fromCharCode(0x20) || data === "\t") {
					currentLine += data;
					terminal.write(data);
				}
			}
		}
	});

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			e.preventDefault();
			onExit();
		}
	}
	window.addEventListener("keydown", onKeyDown);

	return {
		dispose() {
			window.removeEventListener("keydown", onKeyDown);
			dataDisposable.dispose();
			terminal.dispose();
		},
		fit() {
			fitAddon.fit();
		},
	};
}
