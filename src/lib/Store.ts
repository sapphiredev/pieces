import Collection from '@discordjs/collection';
import type { Dirent } from 'fs';
import { opendir } from 'fs/promises';
import { join } from 'path';
import { LoaderError } from './errors/LoaderError';
import type { Piece, PieceOptions } from './Piece';
import type { IPiece } from './strategies/ILoader';
import { LoadSingle } from './strategies/LoadSingle';
import { getName } from './Util';

type Constructor<T> = new (...args: any[]) => T;
type Awaited<T> = PromiseLike<T> | T;

/**
 * The error handler.
 */
export interface StoreOptionsErrorHandler {
	/**
	 * @param error The error that was thrown.
	 * @param path The path of the file that caused the error to be thrown.
	 */
	(error: Error, path: string): void;
}

/**
 * The pre-load hook, use this to override the loader.
 * @example
 * ```typescript
 * // CommonJS support:
 * ((path) => require(path))
 * ```
 * @example
 * ```typescript
 * // ESM support:
 * ((path) => import(path))
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
 *   onLoad: LoadMultiple.onLoad.bind(LoadMultiple)
 * });
 */
export interface StoreOptionsLoadHook<T extends Piece> {
	(store: Store<T>, path: string): AsyncIterableIterator<IPiece<T>>;
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
	 * The preload hook. Setting this will modify the behaviour of the store.
	 * @default ((path) => Promise.resolve().then(() => require(path))
	 */
	readonly onPreload?: StoreOptionsPreLoadHook<T>;

	/**
	 * The load hook. Setting this will modify the behaviour of the store.
	 * @default LoadSingle.onLoad.bind(LoadSingle)
	 */
	readonly onLoad?: StoreOptionsLoadHook<T>;

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

export class Store<T extends Piece> extends Collection<string, T> {
	public readonly Constructor: Constructor<T>;
	public readonly paths: readonly string[];
	public readonly context: unknown;
	public readonly onPreload: StoreOptionsPreLoadHook<T>;
	public readonly onLoad: StoreOptionsLoadHook<T>;
	public readonly onPostLoad: StoreOptionsPostLoadHandler<T>;
	public readonly onUnload: StoreOptionsUnLoadHandler<T>;
	public readonly onError: StoreOptionsErrorHandler;

	public constructor(constructor: Constructor<T>, options: StoreOptions<T> = {}) {
		super();
		this.Constructor = constructor;
		this.paths = options.paths ?? [];
		this.context = options.context;
		this.onPreload = options.onPreload ?? ((path) => import(path));
		this.onLoad = options.onLoad ?? LoadSingle.onLoad.bind(LoadSingle);
		this.onPostLoad = options.onPostLoad ?? (() => void 0);
		this.onUnload = options.onUnload ?? (() => void 0);
		this.onError = options.onError ?? ((error) => console.error(error));
	}

	public async *load(path: string): AsyncIterableIterator<T> {
		const options: PieceOptions = { name: getName(path), enabled: true };
		for await (const Ctor of this.onLoad(this, path)) {
			yield this.insert(new Ctor({ context: this.context, path }, options));
		}
	}

	public unload(name: string | T): T {
		const piece = this.resolve(name);
		this.delete(piece.name);
		this.onUnload(this, piece);
		return piece;
	}

	public async loadAll(): Promise<void> {
		const pieces: T[] = [];

		for (const path of this.paths) {
			for await (const piece of this.loadPath(path)) {
				pieces.push(piece);
			}
		}

		this.clear();
		for (const piece of pieces) {
			this.insert(piece);
		}
	}

	public resolve(name: string | T): T {
		if (typeof name === 'string') {
			const result = this.get(name);
			if (typeof result === 'undefined') throw new LoaderError('UNLOADED_PIECE', `The piece ${name} does not exist.`);
			return result;
		}

		return name;
	}

	protected insert(piece: T): T {
		this.set(piece.name, piece);
		this.onPostLoad(this, piece);
		return piece;
	}

	private async *loadPath(directory: string): AsyncIterableIterator<T> {
		for await (const child of this.walk(directory)) {
			const path = join(directory, child.name);
			const name = getName(path);
			try {
				for await (const Ctor of this.onLoad(this, path)) {
					yield new Ctor({ context: this.context, path }, { name });
				}
			} catch (error) {
				this.onError(error, path);
			}
		}
	}

	private async *walk(path: string): AsyncIterableIterator<Dirent> {
		const dir = await opendir(path);
		for await (const item of dir) {
			if (item.isFile()) yield item;
			else if (item.isDirectory()) yield* this.walk(join(dir.path, item.name));
		}
	}
}
