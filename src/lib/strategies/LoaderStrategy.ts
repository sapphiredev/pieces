import { basename, extname } from 'path';
import { URL } from 'url';
import { MissingExportsError } from '../errors/MissingExportsError';
import { mjsImport } from '../internal';
import type { Piece } from '../Piece';
import type { Store } from '../Store';
import type { AsyncPreloadResult, FilterResult, ILoaderResult, ILoaderStrategy, ModuleData } from './ILoaderStrategy';
import { classExtends, isClass } from './Shared';

/**
 * A multi-purpose feature-complete loader strategy supporting multi-piece modules as well as supporting both ECMAScript
 * Modules and CommonJS with reloading support.
 */
export class LoaderStrategy<T extends Piece> implements ILoaderStrategy<T> {
	private readonly clientESM: boolean = require.main === undefined;
	private readonly supportedExtensions: readonly string[] = ['.js', '.cjs', '.mjs'];

	public filter(path: string): FilterResult {
		// Retrieve the file extension.
		const extension = extname(path);
		if (!this.supportedExtensions.includes(extension)) return null;

		// Retrieve the name of the file, return null if empty.
		const name = basename(path, extension);
		if (name === '') return null;

		// Return the name and extension.
		return { extension, path: name };
	}

	public async preload(file: ModuleData): AsyncPreloadResult<T> {
		const mjs = file.extension === '.mjs' || (file.extension === '.js' && this.clientESM);
		if (mjs) {
			const url = new URL(file.path, 'file:');
			url.searchParams.append('d', Date.now().toString());
			return mjsImport(url);
		}

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const mod = require(file.path);
		delete require.cache[require.resolve(file.path)];
		return mod;
	}

	public async *load(store: Store<T>, file: ModuleData): ILoaderResult<T> {
		let yielded = false;
		const result = await this.preload(file);

		// Support `module.exports`:
		if (isClass(result) && classExtends(result, store.Constructor)) {
			yield result;
			yielded = true;
		}

		// Support any other export:
		for (const value of Object.values(result)) {
			if (isClass(value) && classExtends(value, store.Constructor)) {
				yield value;
				yielded = true;
			}
		}

		if (!yielded) {
			throw new MissingExportsError(file.path);
		}
	}

	public onPostLoad(): unknown {
		return undefined;
	}

	public onUnload(): unknown {
		return undefined;
	}

	public onError(error: Error, path: string): void {
		console.error(`Error when loading '${path}':`, error);
	}
}
