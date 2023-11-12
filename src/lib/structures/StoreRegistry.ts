import { Collection } from '@discordjs/collection';
import { Constructor, classExtends, isClass } from '@sapphire/utilities';
import { join } from 'path';
import { LoaderError, LoaderErrorType } from '../errors/LoaderError';
import { resolvePath, type Path } from '../internal/Path';
import { getRootData } from '../internal/RootScan';
import { VirtualPath } from '../internal/constants';
import type { Piece } from './Piece';
import type { Store } from './Store';

type Key = keyof StoreRegistryEntries;
type Value = StoreRegistryEntries[Key];

/**
 * A strict-typed store registry. This is available in {@link container}.
 * @since 2.1.0
 * @example
 * ```typescript
 * // Adding new stores
 *
 * // Register the store:
 * container.stores.register(new RouteStore());
 *
 * // Augment Sapphire to add the new store, in case of a JavaScript
 * // project, this can be moved to an `Augments.d.ts` (or any other name)
 * // file somewhere:
 * declare module '@sapphire/pieces' {
 *   export interface StoreRegistryEntries {
 *     routes: RouteStore;
 *   }
 * }
 * ```
 */
export class StoreRegistry extends Collection<Key, Value> {
	/**
	 * The queue of pieces to load.
	 */
	readonly #loadQueue: StoreLoadPieceQueueEntry<keyof StoreRegistryEntries>[] = [];
	/**
	 * Whether or not the registry is loaded.
	 */
	#calledLoad = false;

	/**
	 * Loads all the registered stores.
	 * @since 2.1.0
	 */
	public async load() {
		this.#calledLoad = true;

		const promises: Promise<unknown>[] = [];

		// Load the queue first
		for (const entry of this.#loadQueue) {
			promises.push(this.#loadQueueEntry(entry));
		}
		this.#loadQueue.length = 0;

		// Load from FS
		for (const store of this.values() as IterableIterator<Store<Piece>>) {
			promises.push(store.loadAll());
		}

		await Promise.all(promises);
	}

	/**
	 * Registers all user directories from the process working directory, the default value is obtained by assuming
	 * CommonJS (high accuracy) but with fallback for ECMAScript Modules (reads package.json's `main` entry, fallbacks
	 * to `process.cwd()`).
	 *
	 * By default, if you have this folder structure:
	 * ```
	 * /home/me/my-bot
	 * ├─ src
	 * │  ├─ commands
	 * │  ├─ events
	 * │  └─ main.js
	 * └─ package.json
	 * ```
	 *
	 * And you run `node src/main.js`, the directories `/home/me/my-bot/src/commands` and `/home/me/my-bot/src/events` will
	 * be registered for the commands and events stores respectively, since both directories are located in the same
	 * directory as your main file.
	 *
	 * **Note**: this also registers directories for all other stores, even if they don't have a folder, this allows you
	 * to create new pieces and hot-load them later anytime.
	 * @since 2.1.0
	 * @param rootDirectory The root directory to register pieces at.
	 */
	public registerPath(rootDirectory: Path = getRootData().root) {
		const root = resolvePath(rootDirectory);
		for (const store of this.values() as IterableIterator<Store<Piece>>) {
			store.registerPath(join(root, store.name));
		}
	}

	/**
	 * Registers a store.
	 * @since 2.1.0
	 * @param store The store to register.
	 */
	public register<T extends Piece>(store: Store<T>): this {
		this.set(store.name as Key, store as unknown as Value);
		return this;
	}

	/**
	 * Deregisters a store.
	 * @since 2.1.0
	 * @param store The store to deregister.
	 */
	public deregister<T extends Piece>(store: Store<T>): this {
		this.delete(store.name as Key);
		return this;
	}

	/**
	 * If the registry's {@linkcode StoreRegistry.load()} method wasn't called yet, this method validates whether or not
	 * `entry.piece` is a class, throwing a {@link TypeError} if it isn't, otherwise it will queue the entry for later
	 * when {@linkcode StoreRegistry.load()} is called.
	 *
	 * If it was called, the entry will be loaded immediately without queueing.
	 *
	 * @remarks
	 *
	 * - Pieces loaded this way will have their {@linkcode Piece.Context.root root} and
	 *   {@linkcode Piece.Context.path path} set to {@linkcode VirtualPath}, and as such, cannot be reloaded.
	 * - This method is useful in environments where FS access is limited or unavailable, such as serverless.
	 * - The loaded method will throw a {@linkcode LoaderError} if:
	 *   - The store does not exist.
	 *   - The piece does not extend the {@linkcode Store.Constructor store's piece constructor}.
	 * - This operation is atomic, if any of the above errors are thrown, the piece will not be loaded.
	 *
	 * @since 3.8.0
	 * @param entry The entry to load.
	 * @example
	 * ```typescript
	 * import { container } from '@sapphire/pieces';
	 *
	 * class PingCommand extends Command {
	 *   // ...
	 * }
	 *
	 * container.stores.loadPiece({
	 *   store: 'commands',
	 *   name: 'ping',
	 *   piece: PingCommand
	 * });
	 * ```
	 */
	public async loadPiece<StoreName extends keyof StoreRegistryEntries>(entry: StoreLoadPieceQueueEntry<StoreName>) {
		if (!isClass(entry.piece)) {
			throw new TypeError(`The piece ${entry.name} is not a Class. ${String(entry.piece)}`);
		}

		if (this.#calledLoad) {
			await this.#loadQueueEntry(entry);
		} else {
			this.#loadQueue.push(entry);
		}
	}

	/**
	 * Loads a {@link StoreLoadPieceQueueEntry}.
	 * @param entry The entry to load.
	 * @returns The loaded piece.
	 */
	#loadQueueEntry<StoreName extends keyof StoreRegistryEntries>(entry: StoreLoadPieceQueueEntry<StoreName>) {
		const store = this.get(entry.store) as Store<Piece> | undefined;

		// If the store does not exist, throw an error:
		if (!store) {
			throw new LoaderError(LoaderErrorType.UnknownStore, `The store ${entry.store} does not exist.`);
		}

		// If the piece does not extend the store's Piece class, throw an error:
		if (!classExtends(entry.piece, store.Constructor as Constructor<Piece>)) {
			throw new LoaderError(LoaderErrorType.IncorrectType, `The piece ${entry.name} does not extend ${store.name}`);
		}

		const piece = store.construct(entry.piece, { name: entry.name, root: VirtualPath, path: VirtualPath, extension: VirtualPath });
		return store.insert(piece);
	}
}

export interface StoreRegistry {
	get<K extends Key>(key: K): StoreRegistryEntries[K];
	get(key: string): undefined;
	has(key: Key): true;
	has(key: string): false;
}

/**
 * The {@link StoreRegistry}'s registry, use module augmentation against this interface when adding new stores.
 * @since 2.1.0
 */
export interface StoreRegistryEntries {}

/**
 * The {@link StoreRegistry}'s load entry, use module augmentation against this interface when adding new stores.
 * @seealso {@linkcode StoreRegistry.loadPiece()}
 * @since 3.8.0
 */
export interface StoreLoadPieceQueueEntry<StoreName extends keyof StoreRegistryEntries> {
	store: StoreName;
	name: string;
	piece: StoreRegistryEntries[StoreName] extends Store<infer Piece> ? Constructor<Piece> : never;
}
