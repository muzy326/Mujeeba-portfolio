import { open, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const resumePath = resolve(appRoot, 'public/resume.pdf');
const generatedPath = resolve(appRoot, 'src/app/resume-status.generated.ts');

let resumeAvailable = false;

try {
  const file = await open(resumePath, 'r');
  const header = Buffer.alloc(5);
  const { bytesRead } = await file.read(header, 0, header.length, 0);
  await file.close();
  resumeAvailable = bytesRead === 5 && header.toString('ascii') === '%PDF-';
} catch {
  resumeAvailable = false;
}

await writeFile(
  generatedPath,
  `// Updated by scripts/prepare-resume.mjs before serving or building.\nexport const RESUME_AVAILABLE = ${resumeAvailable};\n`,
);
