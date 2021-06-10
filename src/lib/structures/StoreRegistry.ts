import Collection from '@discordjs/collection';
import { join } from 'path';
import { getRootData } from '../internal/RootScan';
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
	 * Loads all the registered stores.
	 * @since 2.1.0
	 */
	public async load() {
		const promises: Promise<void>[] = [];
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
	public registerPath(rootDirectory = getRootData().root) {
		for (const store of this.values() as IterableIterator<Store<Piece>>) {
			store.registerPath(join(rootDirectory, store.name));
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
