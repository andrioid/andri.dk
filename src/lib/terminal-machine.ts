import { setup } from "xstate";

import type { Terminal } from "@xterm/xterm";
import type { ParsedCommand } from "./terminal-parser";

export type TerminalMachineContext = {
	terminal: Terminal;
	onExit: () => void;
};

export type TerminalMachineEvents =
	| { type: "COMMAND"; parsed: ParsedCommand }
	| { type: "INPUT"; value: string }
	| { type: "INTERRUPT" };

export const terminalMachine = setup({
	types: {
		context: {} as TerminalMachineContext,
		events: {} as TerminalMachineEvents,
		input: {} as { terminal: Terminal; onExit: () => void },
	},
	guards: {
		isCommand: ({ event }, params: { name: string }) => {
			if (event.type !== "COMMAND") return false;
			return event.parsed.command === params.name;
		},
		hasFlag: ({ event }, params: { flag: string }) => {
			if (event.type !== "COMMAND") return false;
			return params.flag in event.parsed.flags;
		},
		inputIs: ({ event }, params: { value: string }) => {
			if (event.type !== "INPUT") return false;
			return event.value.toLowerCase() === params.value;
		},
	},
	actions: {
		writeHello: ({ context }) => {
			context.terminal.writeln(
				"Hello! Welcome to my corner of the internet.",
			);
			context.terminal.writeln(
				"I'm Andri \u2014 a software developer based in Aalborg, Denmark.",
			);
		},
		writeLs: ({ context }) => {
			context.terminal.writeln("about.txt  projects/  contact.md");
		},
		writePs: ({ context }) => {
			context.terminal.writeln("  PID  CMD");
			context.terminal.writeln("    1  andri.dk");
			context.terminal.writeln("    2  coffee --daemon");
			context.terminal.writeln("    2  pizzad");
		},
		writeWho: ({ context }) => {
			context.terminal.writeln("anonymous\t\ttty0\t\tjust now");
		},
		writeW: ({ context }) => {
			context.terminal.writeln("USER\t\tTTY\tIDLE\tWHAT");
			context.terminal.writeln("anonymous\t\ttty0\t0:00\tw");
		},
		writeRmPrompt: ({ context }) => {
			context.terminal.write(
				"rm: are you sure? this can't be undone (y/n) ",
			);
		},
		writeRmAborted: ({ context }) => {
			context.terminal.writeln("rm: aborted");
		},
		writeSyntaxError: ({ context }) => {
			context.terminal.writeln("Unknown command\n");
		},
		clearTerminal: ({ context }) => {
			context.terminal.clear();
		},
		triggerExit: ({ context }) => {
			context.onExit();
		},
	},
}).createMachine({
	id: "terminal",
	initial: "idle",
	context: ({ input }) => ({
		terminal: input.terminal,
		onExit: input.onExit,
	}),
	states: {
		idle: {
			on: {
				COMMAND: [
					{
						guard: { type: "isCommand", params: { name: "exit" } },
						target: "exited",
					},
					{
						guard: { type: "isCommand", params: { name: "clear" } },
						actions: "clearTerminal",
					},
					{
						guard: { type: "isCommand", params: { name: "hello" } },
						actions: "writeHello",
					},
					{
						guard: { type: "isCommand", params: { name: "ls" } },
						actions: "writeLs",
					},
					{
						guard: { type: "isCommand", params: { name: "ps" } },
						actions: "writePs",
					},
					{
						guard: { type: "isCommand", params: { name: "who" } },
						actions: "writeWho",
					},
					{
						guard: { type: "isCommand", params: { name: "w" } },
						actions: "writeW",
					},
					{
						guard: { type: "isCommand", params: { name: "rm" } },
						target: "confirmingRm",
					},
					{ actions: "writeSyntaxError" },
				],
				// Ctrl+C in idle is a no-op (line clearing handled by terminal.ts)
				INTERRUPT: {},
			},
		},
		confirmingRm: {
			entry: "writeRmPrompt",
			on: {
				INPUT: [
					{
						guard: {
							type: "inputIs",
							params: { value: "y" },
						},
						target: "destroyed",
					},
					{
						target: "idle",
						actions: "writeRmAborted",
					},
				],
				INTERRUPT: {
					target: "idle",
					actions: "writeRmAborted",
				},
			},
		},
		destroyed: {
			type: "final",
			entry: "triggerExit",
		},
		exited: {
			type: "final",
			entry: "triggerExit",
		},
	},
});
