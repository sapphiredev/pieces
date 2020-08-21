import type { IFilter } from './IFilter';
import { basename, extname } from 'path';

/**
 * The JavaScript loader. This loader is the default and filters modules
 * by the `.js` extension.
 */
export const LoadJavaScript: IFilter = {
	getNameData(path) {
		// Retrieve the file extension.
		const extension = extname(path);
		if (extension !== '.js') return null;

		// Retrieve the name of the file, return null if empty.
		const name = basename(path, extension);
		if (name === '') return null;

		// Return the name and extension.
		return { extension, name };
	}
};
