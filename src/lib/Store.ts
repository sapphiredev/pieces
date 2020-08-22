import Collection from '@discordjs/collection';
import { Dirent, promises as fsp } from 'fs';
import { join } from 'path';
import { LoaderError, LoaderErrorType } from './errors/LoaderError';
import type { Piece, PieceContextExtras } from './Piece';
import type { FilterResult } from './strategies/filters/IFilter';
import { LoadJavaScript } from './strategies/filters/LoadJavaScript';
import type { ILoaderResult, ILoaderResultEntry } from './strategies/loaders/ILoader';
import { LoadSingle } from './strategies/loaders/LoadSingle';

export type Constructor<T> = new (...args: any[]) => T;
export type Awaited<T> = PromiseLike<T> | T;

/**
 * The error handler.
 * @example
 * ```typescript
 * // Log errors to console
 * new Store(MyPiece, {
 *   onError: (error) => console.error(error)
 * });
 */
export interface StoreOptionsErrorHandler {
	/**
	 * @param error The error that was thrown.
	 * @param path The path of the file that caused the error to be thrown.
	 */
	(error: Error, path: string): void;
}

/**
 * The filter hook, use this to override the default behavior.
 * @example
 * ```typescript
 * // ts-node support
 * new Store(MyPiece, {
 *   filterHook: (path) => {
 *     const extension = extname(path);
 *     if (!['.js', '.ts'].includes(extension)) return null;
 *     const name = basename(path, extension);
 *     return { extension, name };
 *   }
 * });
 */
export interface StoreOptionsFilterHook {
	/**
	 * @param path The path of the file to get the name and extension from,
	 * allowing null to stop the store from loading it, e.g. on unsupported extensions.
	 */
	(path: string): FilterResult;
}

/**
 * The pre-load hook, use this to override the loader.
 * @example
 * ```typescript
 * // CommonJS support:
 * new Store(MyPiece, {
 *   preloadHook: (path) => require(path)
 * });
 * ```
 * @example
 * ```typescript
 * // ESM support:
 * new Store(MyPiece, {
 *   preloadHook: (path) => import(path)
 * });
 * ```
 */
export interface StoreOptionsPreLoadHook<T extends Piece> {
	/**
	 * @param path The path of the file to be loaded.
	 */
	(path: string): Awaited<Constructor<T> & Record<PropertyKey, unknown>>;
}

/**
 * The load hook, use this to override the loader.
 * @example
 * ```typescript
 * // Using multi-loader:
 * import { LoadMultiple } from '@sapphire/cache';
 *
 * new Store(MyPiece, {
 *   loadHook: LoadMultiple.load.bind(LoadMultiple)
 * });
 */
export interface StoreOptionsLoadHook<T extends Piece> {
	(store: Store<T>, path: string): ILoaderResult<T>;
}

/**
 * The post-load handler.
 */
export interface StoreOptionsPostLoadHandler<T extends Piece> {
	/**
	 * @param store The store that holds the piece.
	 * @param piece The piece that was loaded.
	 */
	(store: Store<T>, piece: T): void;
}

/**
 * The unload handler.
 */
export interface StoreOptionsUnLoadHandler<T extends Piece> {
	/**
	 * @param store The store that held the piece.
	 * @param piece The piece that was unloaded.
	 */
	(store: Store<T>, piece: T): void;
}

/**
 * The options for the store, this features both hooks (changes the behaviour) and handlers (similar to event listeners).
 */
export interface StoreOptions<T extends Piece, C = unknown> {
	/**
	 * The paths to load pieces from, should be absolute.
	 */
	readonly paths?: readonly string[];

	/**
	 * The context to be passed to the pieces.
	 */
	readonly context?: C;

	/**
	 * The filter hook. Setting this will modify the behaviour of the store.
	 * @default LoadJavaScript.getNameData.bind(LoadJavaScript)
	 */
	readonly filterHook?: StoreOptionsFilterHook;

	/**
	 * The preload hook. Setting this will modify the behaviour of the store.
	 * @default ((path) => Promise.resolve().then(() => require(path))
	 */
	readonly preloadHook?: StoreOptionsPreLoadHook<T>;

	/**
	 * The load hook. Setting this will modify the behaviour of the store.
	 * @default LoadSingle.onLoad.bind(LoadSingle)
	 */
	readonly loadHook?: StoreOptionsLoadHook<T>;

	/**
	 * The post-load handler.
	 * @default (() => void 0)
	 */
	readonly onPostLoad?: StoreOptionsPostLoadHandler<T>;

	/**
	 * The unload handler.
	 * @default (() => void 0)
	 */
	readonly onUnload?: StoreOptionsUnLoadHandler<T>;

	/**
	 * The error handler.
	 * @default (error) => console.error(error)
	 */
	readonly onError?: StoreOptionsErrorHandler;
}

/**
 * The store class which contains [[Piece]]s.
 */
export class Store<T extends Piece> extends Collection<string, T> {
	public readonly Constructor: Constructor<T>;
	public readonly paths: Set<string>;
	public readonly filterHook: StoreOptionsFilterHook;
	public readonly preloadHook: StoreOptionsPreLoadHook<T>;
	public readonly loadHook: StoreOptionsLoadHook<T>;
	public readonly onPostLoad: StoreOptionsPostLoadHandler<T>;
	public readonly onUnload: StoreOptionsUnLoadHandler<T>;
	public readonly onError: StoreOptionsErrorHandler;

	/**
	 * @param constructor The piece constructor this store loads.
	 * @param options The options for the store.
	 */
	public constructor(constructor: Constructor<T>, options: StoreOptions<T> = {}) {
		super();
		this.Constructor = constructor;
		this.paths = new Set(options.paths ?? []);
		this.filterHook = options.filterHook ?? LoadJavaScript.getNameData.bind(LoadJavaScript);
		this.preloadHook = options.preloadHook ?? ((path) => import(path));
		this.loadHook = options.loadHook ?? LoadSingle.load.bind(LoadSingle);
		this.onPostLoad = options.onPostLoad ?? (() => void 0);
		this.onUnload = options.onUnload ?? (() => void 0);
		this.onError = options.onError ?? ((error) => console.error(error));
	}

	/**
	 * Registers a directory into the store.
	 * @param path The path to be added.
	 * @example
	 * ```typescript
	 * store
	 *   .registerPath(resolve('commands'))
	 *   .registerPath(resolve('third-party', 'commands'));
	 * ```
	 */
	public registerPath(path: string): this {
		this.paths.add(path);
		return this;
	}

	/**
	 * Loads a piece or more from a path.
	 * @param path The path of the file to load.
	 * @return An async iterator that yields each one of the loaded pieces.
	 */
	public async *load(path: string): AsyncIterableIterator<T> {
		const data = this.filterHook(path);
		if (data === null) return;

		for await (const Ctor of this.loadHook(this, path)) {
			yield await this.insert(this.construct(Ctor, path, data.name));
		}
	}

	/**
	 * Unloads a piece given its instance or its name.
	 * @param name The name of the file to load.
	 * @return Returns the piece that was unloaded.
	 */
	public async unload(name: string | T): Promise<T> {
		const piece = this.resolve(name);
		this.delete(piece.name);
		this.onUnload(this, piece);
		await piece.onUnload();
		return piece;
	}

	/**
	 * Loads all pieces from all directories specified by [[paths]].
	 */
	public async loadAll(): Promise<void> {
		const pieces: T[] = [];

		for (const path of this.paths) {
			for await (const piece of this.loadPath(path)) {
				pieces.push(piece);
			}
		}

		this.clear();
		for (const piece of pieces) {
			await this.insert(piece);
		}
	}

	/**
	 * Resolves a piece by its name or its instance.
	 * @param name The name of the piece or the instance itself.
	 * @return The resolved piece.
	 */
	public resolve(name: string | T): T {
		if (typeof name === 'string') {
			const result = this.get(name);
			if (typeof result === 'undefined') throw new LoaderError(LoaderErrorType.UnloadedPiece, `The piece '${name}' does not exist.`);
			return result;
		}

		if (name instanceof this.Constructor) return name;
		throw new LoaderError(LoaderErrorType.IncorrectType, `The piece '${name.name}' is not an instance of '${this.Constructor.name}'.`);
	}

	/**
	 * The extras to be passed to the constructor of all pieces.
	 */
	protected get extras(): PieceContextExtras {
		return {};
	}

	/**
	 * Inserts a piece into the store.
	 * @param piece The piece to be inserted into the store.
	 * @return The inserted piece.
	 */
	protected async insert(piece: T): Promise<T> {
		if (!piece.enabled) return piece;

		this.set(piece.name, piece);
		this.onPostLoad(this, piece);
		await piece.onLoad();
		return piece;
	}

	/**
	 * Constructs a [[Piece]] instance.
	 * @param Ctor The [[Piece]]'s constructor used to build the instance.
	 * @param path The path of the file.
	 * @param name The name of the piece.
	 */
	protected construct(Ctor: ILoaderResultEntry<T>, path: string, name: string): T {
		return new Ctor({ extras: this.extras, store: (this as unknown) as Store<Piece>, path }, { name, enabled: true });
	}

	/**
	 * Loads a directory into the store.
	 * @param directory The directory to load the pieces from.
	 * @return An async iterator that yields the pieces to be loaded into the store.
	 */
	private async *loadPath(directory: string): AsyncIterableIterator<T> {
		for await (const child of this.walk(directory)) {
			const path = join(directory, child.name);
			const data = this.filterHook(path);
			if (data === null) continue;
			try {
				for await (const Ctor of this.loadHook(this, path)) {
					yield this.construct(Ctor, path, data.name);
				}
			} catch (error) {
				this.onError(error, path);
			}
		}
	}

	/**
	 * Retrieves all possible pieces.
	 * @param path The directory to load the pieces from.
	 * @return An async iterator that yields the modules to be processed and loaded into the store.
	 */
	private async *walk(path: string): AsyncIterableIterator<Dirent> {
		const dir = await fsp.opendir(path);
		for await (const item of dir) {
			if (item.isFile()) yield item;
			else if (item.isDirectory()) yield* this.walk(join(dir.path, item.name));
		}
	}
}
