import { readFileSync } from 'fs';
import { dirname, join } from 'path';

let data: RootData | null = null;
export function getRootData(): RootData {
	if (data !== null) return data;

	const cwd = process.cwd();

	try {
		const file = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
		data = { root: dirname(join(cwd, file.main)), type: file.type === 'module' ? 'ESM' : 'CommonJS' };
	} catch {
		data = { root: cwd, type: 'CommonJS' };
	}

	return data;
}

export interface RootData {
	root: string;
	type: 'ESM' | 'CommonJS';
}
