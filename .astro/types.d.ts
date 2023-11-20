declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2019/07/creating-a-cv-in-react.md": {
	id: "2019/07/creating-a-cv-in-react.md";
  slug: "2019-07/creating-a-cv-in-react";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/08/choosing-a-programming-language.md": {
	id: "2019/08/choosing-a-programming-language.md";
  slug: "2019/08/choosing-a-programming-language";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/08/gatsby-meetup-site.md": {
	id: "2019/08/gatsby-meetup-site.md";
  slug: "gatsby-meetup-site";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/09/go-docker-image.md": {
	id: "2019/09/go-docker-image.md";
  slug: "2019/09/slim-docker-images-for-golang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/09/social-cards/social-cards.md": {
	id: "2019/09/social-cards/social-cards.md";
  slug: "2019/09/announcing-gatsby-plugin-social-cards";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/12/2019-in-tech.md": {
	id: "2019/12/2019-in-tech.md";
  slug: "2019/12/2019-in-tech";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2013-tech-stack.md": {
	id: "2019/2013-tech-stack.md";
  slug: "2013-tech-stack";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2020/meetings-from-home.md": {
	id: "2019/2020/meetings-from-home.md";
  slug: "2020/03/meetings-from-home";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2020/pwa-from-desktop.md": {
	id: "2019/2020/pwa-from-desktop.md";
  slug: "2020/10/adding-web-apps-to-the-linux-desktop";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2020/why-react-native.md": {
	id: "2019/2020/why-react-native.md";
  slug: "2020/02/tech-choices-app";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2021/blogging-with-obsidian-gatsby-and-nextcloud.md": {
	id: "2019/2021/blogging-with-obsidian-gatsby-and-nextcloud.md";
  slug: "2019/2021/blogging-with-obsidian-gatsby-and-nextcloud";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2021/deploy-static-websites-anywhere.md": {
	id: "2019/2021/deploy-static-websites-anywhere.md";
  slug: "2019/2021/deploy-static-websites-anywhere";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2021/env-files.md": {
	id: "2019/2021/env-files.md";
  slug: "2019/2021/env-files";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2021/exciting-tech/exciting-tech-2021.md": {
	id: "2019/2021/exciting-tech/exciting-tech-2021.md";
  slug: "2019/2021/exciting-tech/exciting-tech-2021";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/2021/host-static-websites-on-a-vps.md": {
	id: "2019/2021/host-static-websites-on-a-vps.md";
  slug: "2019/2021/host-static-websites-on-a-vps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/automatic-usb-backup-with-ubuntu.md": {
	id: "2019/automatic-usb-backup-with-ubuntu.md";
  slug: "automatic-usb-backup-with-ubuntu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/breaking-the-silence.md": {
	id: "2019/breaking-the-silence.md";
  slug: "2019/07/breaking-the-silence";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/drafts/deploying-with-github-actions-and-terraform.md": {
	id: "2019/drafts/deploying-with-github-actions-and-terraform.md";
  slug: "2020/devops/app-stack-with-terraform-on-gcp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/drafts/entering-the-wasm-era.md": {
	id: "2019/drafts/entering-the-wasm-era.md";
  slug: "entering-the-wasm-era";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/drafts/redux-reducers-in-go.md": {
	id: "2019/drafts/redux-reducers-in-go.md";
  slug: "2019/08/react-redux-go-webassembly";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/how-a-computer-should-behave.md": {
	id: "2019/how-a-computer-should-behave.md";
  slug: "how-a-computer-should-behave";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/how-i-lost-my-love-of-programming-and-regained-it.md": {
	id: "2019/how-i-lost-my-love-of-programming-and-regained-it.md";
  slug: "how-i-lost-my-love-of-programming-and-regained-it";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/icelandic-virtual-keyboard-for-meego-harmattan.md": {
	id: "2019/icelandic-virtual-keyboard-for-meego-harmattan.md";
  slug: "icelandic-virtual-keyboard-for-meego-harmattan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/mac-osx-for-windows-users.md": {
	id: "2019/mac-osx-for-windows-users.md";
  slug: "mac-osx-for-windows-users";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/modern-php-development-links.md": {
	id: "2019/modern-php-development-links.md";
  slug: "modern-php-development-links";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/php-on-nginx-with-fastcgicaching.md": {
	id: "2019/php-on-nginx-with-fastcgicaching.md";
  slug: "php-on-nginx-with-fastcgicaching";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/piping-remote-backups-through-ssh-with-tar.md": {
	id: "2019/piping-remote-backups-through-ssh-with-tar.md";
  slug: "piping-remote-backups-through-ssh-with-tar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/predictions-for-2012.md": {
	id: "2019/predictions-for-2012.md";
  slug: "predictions-for-2012";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/rant-on-moblin-meego-and-now-tizen.md": {
	id: "2019/rant-on-moblin-meego-and-now-tizen.md";
  slug: "rant-on-moblin-meego-and-now-tizen";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/social-networks-and-the-future.md": {
	id: "2019/social-networks-and-the-future.md";
  slug: "social-networks-and-the-future";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2019/what-i-love-about-gnome-3.md": {
	id: "2019/what-i-love-about-gnome-3.md";
  slug: "what-i-love-about-gnome-3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/declarative-software-environments.md": {
	id: "2022/declarative-software-environments.md";
  slug: "2022/declarative-software-environments";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/home-network.md": {
	id: "2022/home-network.md";
  slug: "2022/home-network";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/migrating-to-astro.md": {
	id: "2022/migrating-to-astro.md";
  slug: "2022/migrating-to-astro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
