import { createActor } from "xstate";

import terminalPrompt from "./terminal-prompt.txt?raw";
import { terminalMachine } from "./terminal-machine";
import { parseCommand } from "./terminal-parser";

const PROMPT = "$ ";

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

	const actor = createActor(terminalMachine, {
		input: { terminal, onExit },
	});
	actor.start();

	terminal.writeln(terminalPrompt);
	terminal.write("\n");
	terminal.writeln("Software Developer & Systems Engineer\n");

	terminal.write(PROMPT);

	let currentLine = "";

	/** Whether the machine is in a state that prompts for input (not a command) */
	function isPrompting() {
		const state = actor.getSnapshot();
		return !state.matches("idle");
	}

	const dataDisposable = terminal.onData((data) => {
		// Ignore input if the machine has reached a final state
		if (actor.getSnapshot().status !== "active") return;

		switch (data) {
			case "\r": {
				terminal.writeln("");
				const input = currentLine.trim();
				currentLine = "";

				if (isPrompting()) {
					actor.send({ type: "INPUT", value: input });
				} else if (input) {
					actor.send({
						type: "COMMAND",
						parsed: parseCommand(input),
					});
				}

				// Only write prompt if still in idle after handling
				if (
					actor.getSnapshot().status === "active" &&
					actor.getSnapshot().matches("idle")
				) {
					terminal.write(PROMPT);
				}
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
				actor.send({ type: "INTERRUPT" });
				currentLine = "";

				if (
					actor.getSnapshot().status === "active" &&
					actor.getSnapshot().matches("idle")
				) {
					terminal.write(PROMPT);
				}
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
			actor.stop();
			dataDisposable.dispose();
			terminal.dispose();
		},
		fit() {
			fitAddon.fit();
		},
	};
}
