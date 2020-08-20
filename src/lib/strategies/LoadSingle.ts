import { LoaderError } from '../errors/LoaderError';
import type { ILoader } from './ILoader';
import { classExtends, isClass } from './Shared';

export const LoadSingle: ILoader = {
	async *onLoad(store, path) {
		const result = await store.onPreload(path);

		// Support `module.exports`:
		if (isClass(result) && classExtends(result, store.Constructor)) return yield result;

		// Support any other export:
		for (const value of Object.values(result)) {
			if (isClass(value) && classExtends(value, store.Constructor)) return yield value;
		}

		throw new LoaderError('EMPTY_MODULE', 'A compatible class export was not found.');
	}
};
