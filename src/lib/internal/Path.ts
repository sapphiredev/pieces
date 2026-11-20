import { fileURLToPath } from 'node:url';

export type Path = URL | string;

export function resolvePath(path: Path): string {
	if (typeof path === 'string') return path;
	return fileURLToPath(path);
}
