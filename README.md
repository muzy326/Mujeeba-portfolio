# Mohammed Mujeeba — Portfolio

Standalone Angular portfolio website. It does not require a backend or database.

## Run locally

Install Node.js (use a version supported by Angular 22), then run:

```bash
npm install
npm run dev
```

Open the local URL shown by Angular CLI (usually http://localhost:4200).

## Production build

```bash
npm run build
```

The static website is generated in `dist/mohammed-portfolio/browser`.

## Deploy to Vercel

Import this folder/repository as a project. Use these settings:

- Framework preset: Other
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist/mohammed-portfolio/browser`

No backend, database, or environment variables are needed for the portfolio itself.

## Resume

Add your real PDF as `public/resume.pdf` if you want the resume download control to provide a file. The app checks for the PDF before each build and explains that the file is unavailable if you have not added it.

## Contact form

The contact form validates input and opens a prefilled email draft in the visitor's email application. It does not send or store messages on a server.
