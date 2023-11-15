import { Collection } from '@discordjs/collection';
import { Constructor, classExtends, isClass, type AbstractConstructor } from '@sapphire/utilities';
import { promises as fsp } from 'fs';
import { join } from 'path';
import { LoaderError, LoaderErrorType } from '../errors/LoaderError';
import { resolvePath, type Path } from '../internal/Path';
import { ManuallyRegisteredPiecesSymbol, VirtualPath } from '../internal/constants';
import { container, type Container } from '../shared/Container';
import type { HydratedModuleData, ILoaderResultEntry, ILoaderStrategy, ModuleData } from '../strategies/ILoaderStrategy';
import { LoaderStrategy } from '../strategies/LoaderStrategy';
import type { Piece } from './Piece';
import { StoreRegistry, type StoreRegistryEntries } from './StoreRegistry';

/**
 * The options for the store, this features both hooks (changes the behaviour) and handlers (similar to event listeners).
 */
export interface StoreOptions<T extends Piece> {
	/**
	 * The name for this store.
	 */
	readonly name: string;

	/**
	 * The paths to load pieces from, should be absolute.
	 * @default []
	 */
	readonly paths?: readonly string[];

	/**
	 * The strategy to be used for the loader.
	 * @default Store.defaultStrategy
	 */
	readonly strategy?: ILoaderStrategy<T>;
}

/**
 * An interface representing a logger function.
 */
export interface StoreLogger {
	/**
	 * @param value The string to print. All strings will be formatted with the format `[STORE => ${name}] [${type}] ${content}`,
	 * where the content may have identifiers (values or names of methods) surrounded by `'`. For example:
	 *
	 * - `[STORE => commands] [LOAD] Skipped piece '/home/user/bot/src/commands/foo.js' as 'LoaderStrategy#filter' returned 'null'.`
	 * - `[STORE => commands] [INSERT] Unloaded new piece 'foo' due to 'enabled' being 'false'.`
	 * - `[STORE => commands] [UNLOAD] Unloaded piece 'foo'.`
	 */
	(value: string): void;
}

/**
 * The store class which contains {@link Piece}s.
 */
export class Store<T extends Piece, StoreName extends keyof StoreRegistryEntries = keyof StoreRegistryEntries> extends Collection<string, T> {
	public readonly Constructor: AbstractConstructor<T>;
	public readonly name: keyof StoreRegistryEntries;
	public readonly paths: Set<string>;
	public readonly strategy: ILoaderStrategy<T>;

	/**
	 * The queue of manually registered pieces to load.
	 */
	private readonly [ManuallyRegisteredPiecesSymbol]: StoreManuallyRegisteredPiece<StoreName>[] = [];

	/**
	 * Whether or not the store has called `loadAll` at least once.
	 */
	#calledLoadAll = false;

	/**
	 * @param constructor The piece constructor this store loads.
	 * @param options The options for the store.
	 */
	public constructor(constructor: AbstractConstructor<T>, options: StoreOptions<T>) {
		super();
		this.Constructor = constructor;
		this.name = options.name as keyof StoreRegistryEntries;
		this.paths = new Set(options.paths ?? []);
		this.strategy = options.strategy ?? Store.defaultStrategy;
	}

	/**
	 * A reference to the {@link Container} object for ease of use.
	 * @see container
	 */
	public get container(): Container {
		return container;
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
	public registerPath(path: Path): this {
		const root = resolvePath(path);

		this.paths.add(root);
		Store.logger?.(`[STORE => ${this.name}] [REGISTER] Registered path '${root}'.`);
		return this;
	}

	/**
	 * Adds a piece into the store's list of manually registered pieces. If {@linkcode Store.loadAll()} was called, the
	 * piece will be loaded immediately, otherwise it will be queued until {@linkcode Store.loadAll()} is called.
	 *
	 * All manually registered pieces will be kept even after they are loaded to ensure they can be loaded again if
	 * {@linkcode Store.loadAll()} is called again.
	 *
	 * @remarks
	 *
	 * - Pieces loaded this way will have their {@linkcode Piece.Context.root root} and
	 *   {@linkcode Piece.Context.path path} set to {@linkcode VirtualPath}, and as such, cannot be reloaded.
	 * - This method is useful in environments where file system access is limited or unavailable, such as when using
	 *   {@link https://en.wikipedia.org/wiki/Serverless_computing Serverless Computing}.
	 * - This method will always throw a {@link TypeError} if `entry.piece` is not a class.
	 * - This method will always throw a {@linkcode LoaderError} if the piece does not extend the
	 *   {@linkcode Store#Constructor store's piece constructor}.
	 * - This operation is atomic, if any of the above errors are thrown, the piece will not be loaded.
	 *
	 * @seealso {@linkcode StoreRegistry.loadPiece()}
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
	 * container.stores.get('commands').loadPiece({
	 *   name: 'ping',
	 *   piece: PingCommand
	 * });
	 * ```
	 */
	public async loadPiece(entry: StoreManuallyRegisteredPiece<StoreName>) {
		if (!isClass(entry.piece)) {
			throw new TypeError(`The piece ${entry.name} is not a Class. ${String(entry.piece)}`);
		}

		// If the piece does not extend the store's Piece class, throw an error:
		if (!classExtends(entry.piece, this.Constructor as Constructor<T>)) {
			throw new LoaderError(LoaderErrorType.IncorrectType, `The piece ${entry.name} does not extend ${this.name}`);
		}

		this[ManuallyRegisteredPiecesSymbol].push(entry);
		if (this.#calledLoadAll) {
			const piece = this.construct(entry.piece as unknown as Constructor<T>, {
				name: entry.name,
				root: VirtualPath,
				path: VirtualPath,
				extension: VirtualPath
			});
			await this.insert(piece);
		}
	}

	/**
	 * Loads one or more pieces from a path.
	 * @param root The root directory the file is from.
	 * @param path The path of the file to load, relative to the `root`.
	 * @return All the loaded pieces.
	 */
	public async load(root: string, path: string): Promise<T[]> {
		if (root === VirtualPath) {
			throw new LoaderError(LoaderErrorType.VirtualPiece, `Cannot load a virtual file.`);
		}

		const full = join(root, path);
		const data = this.strategy.filter(full);
		if (data === null) {
			Store.logger?.(`[STORE => ${this.name}] [LOAD] Skipped piece '${full}' as 'LoaderStrategy#filter' returned 'null'.`);
			return [];
		}

		const promises: Promise<T>[] = [];
		const finishedData = this.hydrateModuleData(root, data);
		for await (const Ctor of this.strategy.load(this, finishedData)) {
			promises.push(this.insert(this.construct(Ctor, finishedData)));
		}

		return Promise.all(promises);
	}

	/**
	 * Unloads a piece given its instance or its name.
	 * @param name The name of the file to load.
	 * @return Returns the piece that was unloaded.
	 */
	public async unload(name: string | T): Promise<T> {
		const piece = this.resolve(name);

		// Unload piece:
		this.strategy.onUnload(this, piece);
		await piece.onUnload();
		Store.logger?.(`[STORE => ${this.name}] [UNLOAD] Unloaded piece '${piece.name}'.`);

		// Remove from cache and return it:
		this.delete(piece.name);
		Store.logger?.(`[STORE => ${this.name}] [UNLOAD] Removed piece '${piece.name}'.`);
		return piece;
	}

	/**
	 * Unloads all pieces from the store.
	 */
	public async unloadAll(): Promise<T[]> {
		const promises: Promise<T>[] = [];
		for (const piece of this.values()) {
			promises.push(this.unload(piece));
		}

		const results = await Promise.all(promises);

		this.strategy.onUnloadAll(this);
		Store.logger?.(`[STORE => ${this.name}] [UNLOAD-ALL] Removed all pieces.`);
		return results;
	}

	/**
	 * Loads all pieces from all directories specified by {@link paths}.
	 */
	public async loadAll(): Promise<void> {
		this.#calledLoadAll = true;

		const pieces: T[] = [];
		for (const entry of this[ManuallyRegisteredPiecesSymbol]) {
			const piece = this.construct(entry.piece as unknown as Constructor<T>, {
				name: entry.name,
				root: VirtualPath,
				path: VirtualPath,
				extension: VirtualPath
			});
			pieces.push(piece);
		}

		for (const path of this.paths) {
			for await (const piece of this.loadPath(path)) {
				pieces.push(piece);
			}
		}

		Store.logger?.(`[STORE => ${this.name}] [LOAD-ALL] Found '${pieces.length}' pieces.`);

		// Clear the store before inserting the new pieces:
		await this.unloadAll();
		Store.logger?.(`[STORE => ${this.name}] [LOAD-ALL] Cleared all pieces.`);

		// Load each piece:
		for (const piece of pieces) {
			await this.insert(piece);
		}

		// Call onLoadAll:
		this.strategy.onLoadAll(this);
		Store.logger?.(`[STORE => ${this.name}] [LOAD-ALL] Successfully loaded '${this.size}' pieces.`);
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
	 * Inserts a piece into the store.
	 * @param piece The piece to be inserted into the store.
	 * @return The inserted piece.
	 */
	public async insert(piece: T): Promise<T> {
		if (!piece.enabled) return piece;

		// Load piece:
		this.strategy.onLoad(this, piece);
		await piece.onLoad();
		Store.logger?.(`[STORE => ${this.name}] [INSERT] Loaded new piece '${piece.name}'.`);

		// If the onLoad disabled the piece, call unload and return it:
		if (!piece.enabled) {
			// Unload piece:
			this.strategy.onUnload(this, piece);
			await piece.onUnload();
			Store.logger?.(`[STORE => ${this.name}] [INSERT] Unloaded new piece '${piece.name}' due to 'enabled' being 'false'.`);

			return piece;
		}

		// Unload existing piece, if any:
		const previous = super.get(piece.name);
		if (previous) {
			await this.unload(previous);
			Store.logger?.(`[STORE => ${this.name}] [INSERT] Unloaded existing piece '${piece.name}' due to conflicting 'name'.`);
		}

		// Set the new piece and return it:
		this.set(piece.name, piece);
		Store.logger?.(`[STORE => ${this.name}] [INSERT] Inserted new piece '${piece.name}'.`);
		return piece;
	}

	/**
	 * Constructs a {@link Piece} instance.
	 * @param Ctor The {@link Piece}'s constructor used to build the instance.
	 * @param data The module's information
	 * @return An instance of the constructed piece.
	 */
	public construct(Ctor: ILoaderResultEntry<T>, data: HydratedModuleData): T {
		return new Ctor({ store: this, root: data.root, path: data.path, name: data.name }, { name: data.name, enabled: true });
	}

	/**
	 * Adds the final module data properties.
	 * @param root The root directory to add.
	 * @param data The module data returned from {@link ILoaderStrategy.filter}.
	 * @returns The finished module data.
	 */
	private hydrateModuleData(root: string, data: ModuleData): HydratedModuleData {
		return { root, ...data };
	}

	/**
	 * Loads a directory into the store.
	 * @param root The directory to load the pieces from.
	 * @return An async iterator that yields the pieces to be loaded into the store.
	 */
	private async *loadPath(root: string): AsyncIterableIterator<T> {
		Store.logger?.(`[STORE => ${this.name}] [WALK] Loading all pieces from '${root}'.`);
		for await (const child of this.walk(root)) {
			const data = this.strategy.filter(child);
			if (data === null) {
				Store.logger?.(`[STORE => ${this.name}] [LOAD] Skipped piece '${child}' as 'LoaderStrategy#filter' returned 'null'.`);
				continue;
			}
			try {
				const finishedData = this.hydrateModuleData(root, data);
				for await (const Ctor of this.strategy.load(this, finishedData)) {
					yield this.construct(Ctor, finishedData);
				}
			} catch (error) {
				this.strategy.onError(error as Error, data.path);
			}
		}
	}

	/**
	 * Retrieves all possible pieces.
	 * @param path The directory to load the pieces from.
	 * @return An async iterator that yields the modules to be processed and loaded into the store.
	 */
	private async *walk(path: string): AsyncIterableIterator<string> {
		Store.logger?.(`[STORE => ${this.name}] [WALK] Loading all pieces from '${path}'.`);
		try {
			const dir = await fsp.opendir(path);
			for await (const item of dir) {
				if (item.isFile()) yield join(dir.path, item.name);
				else if (item.isDirectory()) yield* this.walk(join(dir.path, item.name));
			}
		} catch (error) {
			// Specifically ignore ENOENT, which is commonly raised by fs operations
			// to indicate that a component of the specified pathname does not exist.
			// No entity (file or directory) could be found by the given path.
			if ((error as ErrorWithCode).code !== 'ENOENT') this.strategy.onError(error as Error, path);
		}
	}

	/**
	 * The default strategy, defaults to {@link LoaderStrategy}, which is constructed on demand when a store is constructed,
	 * when none was set beforehand.
	 */
	public static defaultStrategy: ILoaderStrategy<any> = new LoaderStrategy();

	/**
	 * The default logger, defaults to `null`.
	 */
	public static logger: StoreLogger | null = null;
}

/**
 * An entry for a manually registered piece using {@linkcode Store.loadPiece()}.
 * @since 3.8.0
 */
export interface StoreManuallyRegisteredPiece<StoreName extends keyof StoreRegistryEntries> {
	name: string;
	piece: StoreRegistryEntries[StoreName] extends Store<infer Piece> ? Constructor<Piece> : never;
}

type ErrorWithCode = Error & { code: string };

export namespace Store {
	export const Registry = StoreRegistry;
	export type Options<T extends Piece> = StoreOptions<T>;
	export type Logger = StoreLogger;
	export type RegistryEntries = StoreRegistryEntries;
}
