import { LoaderError, LoaderErrorType } from '../../errors/LoaderError';
import type { ILoader } from './ILoader';
import { classExtends, isClass } from '../Shared';

/**
 * The multi-loader. This loader can load multiple classes from a module
 * into the store. The catch is that you must specify the name for each
 * piece.
 */
export const LoadMultiple: ILoader = {
	async *load(store, path) {
		let yielded = false;
		const result = await store.preloadHook(path);

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
			throw new LoaderError(LoaderErrorType.EmptyModule, 'A compatible class export was not found.');
		}
	}
};
