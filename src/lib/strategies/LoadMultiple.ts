import { LoaderError } from '../errors/LoaderError';
import type { ILoader } from './ILoader';
import { classExtends, isClass } from './Shared';

export const LoadMultiple: ILoader = {
	async *onLoad(store, path) {
		let yielded = false;
		const result = await store.onPreload(path);

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
			throw new LoaderError('EMPTY_MODULE', 'A compatible class export was not found.');
		}
	}
};
