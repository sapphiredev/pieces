import { writeFile } from 'fs/promises';

const pathCJS = new URL('../dist/cjs/lib/internal/internal.cjs', import.meta.url);
const pathESM = new URL('../dist/esm/lib/internal/internal.mjs', import.meta.url);

const baseInternalImport = [
	'const __defProp = Object.defineProperty;',
	'const __name = (target, value) => __defProp(target, "name", { value, configurable: true });',
	'',
	'function mjsImport(path) {',
	'	return import(path);',
	'}',
	'',
	'__name(mjsImport, "mjsImport");',
	''
];

await writeFile(pathCJS, ['"use strict";', '', ...baseInternalImport, 'exports.mjsImport = mjsImport;', ''].join('\n'), 'utf-8');
await writeFile(pathESM, [...baseInternalImport, 'export { mjsImport };', ''].join('\n'), { encoding: 'utf-8' });
