import { basename, extname } from 'path';

export function getName(path: string): string {
	const extension = extname(path);
	return basename(path, extension);
}
