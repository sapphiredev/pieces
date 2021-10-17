import { isNullish } from '@sapphire/utilities';
import { basename, extname } from 'path';
import { pathToFileURL } from 'url';
import { MissingExportsError } from '../errors/MissingExportsError';
import { mjsImport } from '../internal/internal';
import { getRootData } from '../internal/RootScan';
import type { Piece } from '../structures/Piece';
import type { Store } from '../structures/Store';
import type { AsyncPreloadResult, FilterResult, ILoaderResult, ILoaderStrategy, ModuleData } from './ILoaderStrategy';
import { classExtends, isClass } from './Shared';

/**
 * A multi-purpose feature-complete loader strategy supporting multi-piece modules as well as supporting both ECMAScript
 * Modules and CommonJS with reloading support.
 */
export class LoaderStrategy<T extends Piece> implements ILoaderStrategy<T> {
	public clientUsesESModules = getRootData().type === 'ESM';
	public supportedExtensions = ['.js', '.cjs', '.mjs'];
	private readonly filterDtsFiles: boolean = false;

	public constructor() {
		/**
		 * If {@linkplain https://github.com/TypeStrong/ts-node ts-node} is being used
		 * we conditionally need to register files ending in the `.ts` file extension.
		 *
		 * This is because `ts-node` builds files into memory, so we have to scan the
		 * source `.ts` files, rather than files emitted with any of the JavaScript
		 * extensions.
		 */
		if (Reflect.has(process, Symbol.for('ts-node.register.instance')) || !isNullish(process.env.TS_NODE_DEV)) {
			this.supportedExtensions.push('.ts');
			this.filterDtsFiles = true;
		}
	}

	public filter(path: string): FilterResult {
		// Retrieve the file extension.
		const extension = extname(path);
		if (!this.supportedExtensions.includes(extension)) return null;

		if (this.filterDtsFiles) {
			const dtsFileExtension = path.slice(-5);
			if (dtsFileExtension === '.d.ts') return null;
		}

		// Retrieve the name of the file, return null if empty.
		const name = basename(path, extension);
		if (name === '') return null;

		// Return the name and extension.
		return { extension, path, name };
	}

	public async preload(file: ModuleData): AsyncPreloadResult<T> {
		const mjs = file.extension === '.mjs' || (file.extension === '.js' && this.clientUsesESModules);
		if (mjs) {
			const url = pathToFileURL(file.path);
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

	public onLoad(): unknown {
		return undefined;
	}

	public onLoadAll(): unknown {
		return undefined;
	}

	public onUnload(): unknown {
		return undefined;
	}

	public onUnloadAll(): unknown {
		return undefined;
	}

	public onError(error: Error, path: string): void {
		console.error(`Error when loading '${path}':`, error);
	}
}
