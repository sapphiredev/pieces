import { basename, extname } from 'path';
import { MissingExportsError } from '../errors/MissingExportsError';
import type { Piece } from '../Piece';
import type { Store } from '../Store';
import type { FilterResult, ILoaderResult, ILoaderStrategy, PreloadResult } from './ILoaderStrategy';
import { classExtends, isClass } from './Shared';

/**
 * An abstracted loader interface.
 */
export class LoaderStrategy<T extends Piece> implements ILoaderStrategy<T> {
	public filter(path: string): FilterResult {
		// Retrieve the file extension.
		const extension = extname(path);
		if (extension !== '.js') return null;

		// Retrieve the name of the file, return null if empty.
		const name = basename(path, extension);
		if (name === '') return null;

		// Return the name and extension.
		return { extension, name };
	}

	public preload(path: string): PreloadResult<T> {
		return import(path);
	}

	public async *load(store: Store<T>, path: string): ILoaderResult<T> {
		const result = await this.preload(path);

		// Support `module.exports`:
		if (isClass(result) && classExtends(result, store.Constructor)) return yield result;

		// Support any other export:
		for (const value of Object.values(result)) {
			if (isClass(value) && classExtends(value, store.Constructor)) return yield value;
		}

		throw new MissingExportsError(path);
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
