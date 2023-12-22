import { readFileSync } from 'fs';
import { dirname, join } from 'path';

let data: RootData | null = null;

/**
 * Retrieves the root data of the project.
 *
 * This function reads the `package.json` file in the current working directory and determines the root path and type
 * of the project.
 *
 * - If the `package.json` file is not found or cannot be parsed, it assumes the project is using CommonJS and
 * the current working directory is used as the root
 *
 * - If the project `type` is specified as `"commonjs"` or `"module"` in the `package.json`, it uses the corresponding
 * `main` or `module` file path as the root.
 *
 *   - If there is no `main` or `module` then it uses the current working directory as the root, while retaining the
 *     matching `CommonJS` or `ESM` based on the `type`
 *
 * - If the main or module file path is not specified, it uses the current working directory as the root.
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
 * @returns The root data object containing the root path and the type of the project.
 */
export function getRootData(): RootData {
	if (data !== null) return data;

	const cwd = process.cwd();

	let file: PartialPackageJson | undefined;

	try {
		file = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8')) as PartialPackageJson;
	} catch (error) {
		return (data = { root: cwd, type: 'CommonJS' });
	}

	const { main: packageMain, module: packageModule, type: packageType } = file;

	const lowerCasedType = packageType?.toLowerCase() as PartialPackageJson['type'];

	if (lowerCasedType === 'commonjs') {
		if (packageMain) return (data = { root: dirnameWithPath(cwd, packageMain), type: 'CommonJS' });
		if (packageModule) return (data = { root: dirnameWithPath(cwd, packageModule), type: 'CommonJS' });
		return (data = { root: cwd, type: 'CommonJS' });
	}

	if (lowerCasedType === 'module') {
		if (packageMain) return (data = { root: dirnameWithPath(cwd, packageMain), type: 'ESM' });
		if (packageModule) return (data = { root: dirnameWithPath(cwd, packageModule), type: 'ESM' });
		return (data = { root: cwd, type: 'ESM' });
	}

	if (packageMain) return (data = { root: dirnameWithPath(cwd, packageMain), type: 'CommonJS' });
	if (packageModule) return (data = { root: dirnameWithPath(cwd, packageModule), type: 'ESM' });

	return (data = { root: cwd, type: 'CommonJS' });
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
