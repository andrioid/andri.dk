# [andri.dk](https://andri.dk)

This is the source code for andri.dk, a personal website and portfolio built with Astro, TypeScript, and React. It serves as a central hub to showcase the author's work, blog posts, CV, and projects.

### License

- `src/content`: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
- Anything else: [MIT](https://opensource.org/licenses/MIT)

### Stack

- TypeScript
- Astro 5.x
- React 19
- Tailwind CSS
- Bun
- Node.js

### Project Structure

```
.
├── src/
│   ├── actions/            # Server-side actions
│   ├── components/         # Re-usable components (Astro and React)
│   ├── content/            # Astro content collections. E.g. blog posts
│   ├── lib/                # Utility functions and libraries
│   └── pages/              # Page routes and layouts
├── public/                 # Static assets
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

### Key Features

- Multilingual support (English, Danish, Icelandic)
- Blog with markdown content
- Interactive CV with React components
- Social media integration
- SEO optimizations with sitemap and RSS
- Server-side rendering with Node.js adapter

### Build and Deployment

- Development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Production: Node.js server with express

### Main Dependencies

- Astro 5.x (core framework)
- React 19 (UI components)
- Tailwind CSS (styling)
- MDX (Markdown with JSX)
- Express (server adapter)
- OpenAI API (AI integration)
