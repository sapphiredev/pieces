import type { Piece } from '../structures/Piece';
import type { Store } from '../structures/Store';
import type { Ctor } from './Shared';

export type Constructor<T> = new (...args: any[]) => T;
export type Awaited<T> = PromiseLike<T> | T;

/**
 * The module data information.
 */
export interface ModuleData {
	/**
	 * The name of the module.
	 */
	name: string;

	/**
	 * The absolute path to the module.
	 */
	path: string;

	/**
	 * The extension of the module.
	 */
	extension: string;
}

/**
 * The result from the filter.
 */
export type FilterResult = ModuleData | null;

/**
 * Represents the return data from [[ILoaderStrategy.preload]]
 */
export type PreloadResult<T extends Piece> = Awaited<Constructor<T> & Record<PropertyKey, unknown>>;

/**
 * Represents the return data from [[ILoaderStrategy.preload]]
 */
export type AsyncPreloadResult<T extends Piece> = Promise<Constructor<T> & Record<PropertyKey, unknown>>;

/**
 * Represents an entry from [[ILoaderResult]].
 */
export type ILoaderResultEntry<T extends Piece> = Ctor<ConstructorParameters<typeof Piece>, T>;

/**
 * Represents the return data from [[ILoaderStrategy.load]].
 */
export type ILoaderResult<T extends Piece> = AsyncIterableIterator<ILoaderResultEntry<T>>;

/**
 * An abstracted loader strategy interface.
 */
export interface ILoaderStrategy<T extends Piece> {
	/**
	 * Retrieves the name and the extension of the specified file path.
	 * @param path The path of the file to be processed.
	 * @return A [[PieceData]] on success, otherwise `null` to stop the store from processing the path.
	 * @example
	 * ```typescript
	 * // ts-node support
	 * class MyStrategy extends LoaderStrategy {
	 *   filter(path) {
	 *     const extension = extname(path);
	 *     if (!['.js', '.ts'].includes(extension)) return null;
	 *     const name = basename(path, extension);
	 *     return { extension, name };
	 *   }
	 * }
	 */
	filter(path: string): FilterResult;

	/**
	 * The pre-load hook, use this to override the loader.
	 * @example
	 * ```typescript
	 * // CommonJS support:
	 * class MyStrategy extends LoaderStrategy {
	 *   preload(path) {
	 *     return require(path);
	 *   }
	 * }
	 * ```
	 * @example
	 * ```typescript
	 * // ESM support:
	 * class MyStrategy extends LoaderStrategy {
	 *   preload(file) {
	 *     return import(file.path);
	 *   }
	 * }
	 * ```
	 */
	preload(file: ModuleData): PreloadResult<T>;

	/**
	 * The load hook, use this to override the loader.
	 * @example
	 * ```typescript
	 * class MyStrategy extends LoaderStrategy {
	 *   load(store, file) {
	 *     // ...
	 *   }
	 * }
	 */
	load(store: Store<T>, file: ModuleData): ILoaderResult<T>;

	/**
	 * Called after a piece has been loaded, but before [[Piece.onLoad]] and [[Store.set]].
	 * @param store The store that holds the piece.
	 * @param piece The piece that was loaded.
	 */
	onLoad(store: Store<T>, piece: T): Awaited<unknown>;

	/**
	 * Called after all pieces have been loaded.
	 * @param store The store that loaded all pieces.
	 */
	onLoadAll(store: Store<T>): Awaited<unknown>;

	/**
	 * Called after a piece has been unloaded or overwritten by a newly loaded piece.
	 * @param store The store that held the piece.
	 * @param piece The piece that was unloaded.
	 */
	onUnload(store: Store<T>, piece: T): Awaited<unknown>;

	/**
	 * @param error The error that was thrown.
	 * @param path The path of the file that caused the error to be thrown.
	 */
	onError(error: Error, path: string): void;
}
