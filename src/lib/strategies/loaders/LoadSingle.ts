import { LoaderError, LoaderErrorType } from '../../errors/LoaderError';
import type { ILoader } from './ILoader';
import { classExtends, isClass } from '../Shared';

/**
 * The single loader. This loader is the default and returns the first loaded class.
 */
export const LoadSingle: ILoader = {
	async *load(store, path) {
		const result = await store.preloadHook(path);

		// Support `module.exports`:
		if (isClass(result) && classExtends(result, store.Constructor)) return yield result;

		// Support any other export:
		for (const value of Object.values(result)) {
			if (isClass(value) && classExtends(value, store.Constructor)) return yield value;
		}

		throw new LoaderError(LoaderErrorType.EmptyModule, 'A compatible class export was not found.');
	}
};
