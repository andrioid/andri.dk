declare namespace App {
	interface Locals {
		/** UI language, resolved per request in src/middleware.ts. */
		locale: import("./lib/i18n").Locale;
		/** The visitor's Accept-Language as primary subtags, best first. */
		acceptedLanguages: Array<string>;
	}
}
