import { isNullish, type Awaitable } from '@sapphire/utilities';
import { basename, extname } from 'path';
import { pathToFileURL } from 'url';
import { MissingExportsError } from '../errors/MissingExportsError';
import { getRootData } from '../internal/RootScan';
import { mjsImport } from '../internal/internal';
import type { Piece } from '../structures/Piece';
import type { Store } from '../structures/Store';
import type {
	AsyncPreloadResult,
	FilterResult,
	HydratedModuleData,
	ILoaderResult,
	ILoaderResultEntry,
	ILoaderStrategy,
	ModuleData
} from './ILoaderStrategy';
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
			this.supportedExtensions.push('.ts', '.cts', '.mts');
			this.filterDtsFiles = true;
		}
	}

	public filter(path: string): FilterResult {
		// Retrieve the file extension.
		const extension = extname(path);
		if (!this.supportedExtensions.includes(extension)) return null;

		if (this.filterDtsFiles && path.endsWith('.d.ts')) return null;

		// Retrieve the name of the file, return null if empty.
		const name = basename(path, extension);
		if (name === '' || name.startsWith('_')) return null;

		// Return the name and extension.
		return { extension, path, name };
	}

	public async preload(file: ModuleData): AsyncPreloadResult<T> {
		const mjs = ['.mjs', '.mts'].includes(file.extension) || (['.js', '.ts'].includes(file.extension) && this.clientUsesESModules);
		if (mjs) {
			const url = pathToFileURL(file.path);
			url.searchParams.append('d', Date.now().toString());
			url.searchParams.append('name', file.name);
			url.searchParams.append('extension', file.extension);
			return mjsImport(url);
		}

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const mod = require(file.path);
		delete require.cache[require.resolve(file.path)];
		return mod;
	}

	public async *load(store: Store<T>, file: HydratedModuleData): ILoaderResult<T> {
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
				yield value as ILoaderResultEntry<T>;
				yielded = true;
			}
		}

		if (!yielded) {
			throw new MissingExportsError(file.path);
		}
	}

	public onLoad(store: Store<T>, piece: T): Awaitable<unknown>;
	public onLoad(): unknown {
		return undefined;
	}

	public onLoadAll(store: Store<T>): Awaitable<unknown>;
	public onLoadAll(): unknown {
		return undefined;
	}

	public onUnload(store: Store<T>, piece: T): Awaitable<unknown>;
	public onUnload(): unknown {
		return undefined;
	}

	public onUnloadAll(store: Store<T>): Awaitable<unknown>;
	public onUnloadAll(): unknown {
		return undefined;
	}

	public onError(error: Error, path: string): void {
		console.error(`Error when loading '${path}':`, error);
	}
}
