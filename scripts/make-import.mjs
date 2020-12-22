import { writeFile } from 'fs/promises';

const path = new URL('../dist/lib/internal/import.js', import.meta.url);
await writeFile(path, ['"use strict";', 'exports.mjsImport = (path) => import(path);', ''].join('\n'));
