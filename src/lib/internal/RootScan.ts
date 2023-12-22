import { readFileSync } from 'fs';
import { dirname, join } from 'path';

let data: RootData | null = null;
const errorMessage = 'No main or module field in package.json';

/**
 * Retrieves the root data.
 *
 * The following table shows how different situations resolve to different root data
 *
 * | fields                   | resolved as |
 * |--------------------------|-------------|
 * | type=commonjs && main    | CommonJS    |
 * | type=commonjs && module  | CommonJS    |
 * | type=module && main      | ESM         |
 * | type=module && module    | ESM         |
 * | type=undefined && main   | CommonJS    |
 * | type=undefined && module | ESM         |
 * | no package.json on cwd   | CommonJS    |
 *
 * @returns The root data.
 */
export function getRootData(): RootData {
	if (data !== null) return data;

	const cwd = process.cwd();

	try {
		const file = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8')) as PartialPackageJson;
		const { main, module, type } = file;

		if (!type) {
			if (main) return (data = { root: dirnameWithPath(cwd, main), type: 'CommonJS' });
			if (module) return (data = { root: dirnameWithPath(cwd, module), type: 'ESM' });
			throw new Error(errorMessage);
		}

		const lowerCasedType = type.toLowerCase() as NonNullable<PartialPackageJson['type']>;

		if (lowerCasedType === 'commonjs') {
			if (main) return (data = { root: dirnameWithPath(cwd, main), type: 'CommonJS' });
			if (module) return (data = { root: dirnameWithPath(cwd, module), type: 'CommonJS' });
			throw new Error(errorMessage);
		}

		if (lowerCasedType === 'module') {
			if (main) return (data = { root: dirnameWithPath(cwd, main), type: 'ESM' });
			if (module) return (data = { root: dirnameWithPath(cwd, module), type: 'ESM' });
			throw new Error(errorMessage);
		}

		throw new Error('Failed to parse package.json when scanning for a root');
	} catch {
		data = { root: cwd, type: 'CommonJS' };
	}

	return data;
}

/**
 * Returns the directory name of a given path by joining the current working directory (cwd) with the joinable path.
 * @param cwd - The current working directory.
 * @param joinablePath - The path to be joined with the cwd.
 * @returns The directory name of the joined path.
 */
function dirnameWithPath(cwd: string, joinablePath: string) {
	return dirname(join(cwd, joinablePath));
}

/**
 * Resets the root data cache.
 */
export function resetRootDataCache() {
	data = null;
}

/**
 * Represents the root data.
 */
export interface RootData {
	/**
	 * The root directory.
	 */
	root: string;

	/**
	 * The type of the module system used.
	 * It can be either 'ESM' or 'CommonJS'.
	 */
	type: 'ESM' | 'CommonJS';
}

/**
 * Represents a partial package.json object.
 */
type PartialPackageJson = Partial<{
	main: string;
	module: string;
	type: 'commonjs' | 'module';
}>;
