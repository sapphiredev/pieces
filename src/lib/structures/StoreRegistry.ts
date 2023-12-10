import { Collection } from '@discordjs/collection';
import { isClass } from '@sapphire/utilities';
import { join } from 'path';
import { LoaderError } from '../errors/LoaderError';
import { resolvePath, type Path } from '../internal/Path';
import { getRootData } from '../internal/RootScan';
import { ManuallyRegisteredPiecesSymbol, VirtualPath } from '../internal/constants';
import type { Piece } from './Piece';
import type { Store, StoreManuallyRegisteredPiece } from './Store';

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
export class StoreRegistry extends Collection<StoreRegistryKey, StoreRegistryValue> {
	/**
	 * The queue of pieces to load.
	 */
	readonly #pendingManuallyRegisteredPieces = new Collection<StoreRegistryKey, StoreManuallyRegisteredPiece<StoreRegistryKey>[]>();

	/**
	 * Loads all the registered stores.
	 * @since 2.1.0
	 */
	public async load() {
		const promises: Promise<unknown>[] = [];
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
	 *
	 * @remarks
	 *
	 * - This method will allow {@linkcode StoreRegistry} to manage the store, meaning:
	 *   - {@linkcode StoreRegistry.registerPath()} will call the store's
	 *     {@linkcode Store.registerPath() registerPath()} method on call.
	 *   - {@linkcode StoreRegistry.load()} will call the store's {@linkcode Store.load() load()} method on call.
	 *   - {@linkcode StoreRegistry.loadPiece()} will call the store's {@linkcode Store.loadPiece() loadPiece()} method
	 *     on call.
	 * - This will also add all the manually registered pieces by {@linkcode StoreRegistry.loadPiece()} in the store.
	 *
	 * It is generally recommended to register a store as early as possible, before any of the aforementioned methods
	 * are called, otherwise you will have to manually call the aforementioned methods for the store to work properly.
	 *
	 * If there were manually registered pieces for this store with {@linkcode StoreRegistry.loadPiece()}, this method
	 * will add them to the store and delete the queue. Note, however, that this method will not call the store's
	 * {@linkcode Store.loadPiece() loadPiece()} method, and as such, the pieces will not be loaded until
	 * {@linkcode Store.loadAll()} is called.
	 *
	 * @since 2.1.0
	 * @param store The store to register.
	 */
	public register<T extends Piece>(store: Store<T>): this {
		this.set(store.name as StoreRegistryKey, store as unknown as StoreRegistryValue);

		// If there was a queue for this store, add it to the store and delete the queue:
		const queue = this.#pendingManuallyRegisteredPieces.get(store.name);
		if (queue) {
			store[ManuallyRegisteredPiecesSymbol].push(...queue);
			this.#pendingManuallyRegisteredPieces.delete(store.name);
		}

		return this;
	}

	/**
	 * Deregisters a store.
	 * @since 2.1.0
	 * @param store The store to deregister.
	 */
	public deregister<T extends Piece>(store: Store<T>): this {
		this.delete(store.name as StoreRegistryKey);
		return this;
	}

	/**
	 * If the store was {@link StoreRegistry.register registered}, this method will call the store's
	 * {@linkcode Store.loadPiece() loadPiece()} method.
	 *
	 * If it was called, the entry will be loaded immediately without queueing.
	 *
	 * @remarks
	 *
	 * - Pieces loaded this way will have their {@linkcode Piece.Context.root root} and
	 *   {@linkcode Piece.Context.path path} set to {@linkcode VirtualPath}, and as such, cannot be reloaded.
	 * - This method is useful in environments where file system access is limited or unavailable, such as when using
	 *   {@link https://en.wikipedia.org/wiki/Serverless_computing Serverless Computing}.
	 * - This method will not throw an error if a store with the given name does not exist, it will simply be queued
	 *   until it's registered.
	 * - This method will always throw a {@link TypeError} if `entry.piece` is not a class.
	 * - If the store is registered, this method will always throw a {@linkcode LoaderError} if the piece does not
	 *   extend the registered {@linkcode Store.Constructor store's piece constructor}.
	 * - This operation is atomic, if any of the above errors are thrown, the piece will not be loaded.
	 *
	 * @seealso {@linkcode Store.loadPiece()}
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
	public async loadPiece<StoreName extends StoreRegistryKey>(entry: StoreManagerManuallyRegisteredPiece<StoreName>) {
		const store = this.get(entry.store) as Store<Piece, StoreName> | undefined;

		if (store) {
			await store.loadPiece(entry);
		} else {
			if (!isClass(entry.piece)) {
				throw new TypeError(`The piece ${entry.name} is not a Class. ${String(entry.piece)}`);
			}

			this.#pendingManuallyRegisteredPieces.ensure(entry.store, () => []).push({ name: entry.name, piece: entry.piece });
		}
	}
}

export interface StoreRegistry {
	get<K extends StoreRegistryKey>(key: K): StoreRegistryEntries[K];
	get(key: string): undefined;
	has(key: StoreRegistryKey): true;
	has(key: string): false;
}

/**
 * A type utility to get the keys of {@linkcode StoreRegistryEntries}.
 * @since 3.10.0
 */
export type StoreRegistryKey = keyof StoreRegistryEntries;

/**
 * A type utility to get the values of {@linkcode StoreRegistryEntries}.
 * @since 3.10.0
 */
export type StoreRegistryValue = StoreRegistryEntries[StoreRegistryKey];

/**
 * The {@link StoreRegistry}'s registry, use module augmentation against this interface when adding new stores.
 * @since 2.1.0
 */
export interface StoreRegistryEntries {}

/**
 * An entry for a manually registered piece using {@linkcode StoreRegistry.loadPiece()}.
 * @seealso {@linkcode StoreRegistry.loadPiece()}
 * @since 3.8.0
 */
export interface StoreManagerManuallyRegisteredPiece<StoreName extends StoreRegistryKey> extends StoreManuallyRegisteredPiece<StoreName> {
	store: StoreName;
}

/**
 * Type utility to get the {@linkcode Store} given its name.
 * @since 3.10.0
 */
export type StoreOf<StoreName extends StoreRegistryKey> = StoreRegistryKey extends never
	? Store<Piece<Piece.Options, StoreName>>
	: StoreRegistryEntries[StoreName];

/**
 * Type utility to get the {@linkcode Piece} given its {@linkcode Store}'s name.
 * @since 3.10.0
 */
export type PieceOf<StoreName extends StoreRegistryKey> = StoreRegistryKey extends never
	? Piece<Piece.Options, StoreName>
	: StoreRegistryEntries[StoreName] extends Store<infer PieceType>
		? PieceType
		: Piece<Piece.Options, StoreName>;
