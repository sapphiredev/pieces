import Collection from '@discordjs/collection';
import { promises as fsp } from 'fs';
import { join } from 'path';
import { LoaderError, LoaderErrorType } from '../errors/LoaderError';
import type { Constructor, ILoaderResultEntry, ILoaderStrategy, ModuleData } from '../strategies/ILoaderStrategy';
import { LoaderStrategy } from '../strategies/LoaderStrategy';
import type { Piece, PieceContextExtras } from './Piece';

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
 * The store class which contains [[Piece]]s.
 */
export class Store<T extends Piece> extends Collection<string, T> {
	public readonly Constructor: Constructor<T>;
	public readonly name: string;
	public readonly paths: Set<string>;
	public readonly strategy: ILoaderStrategy<T>;

	/**
	 * @param constructor The piece constructor this store loads.
	 * @param options The options for the store.
	 */
	public constructor(constructor: Constructor<T>, options: StoreOptions<T>) {
		super();
		this.Constructor = constructor;
		this.name = options.name;
		this.paths = new Set(options.paths ?? []);
		this.strategy = options.strategy ?? Store.defaultStrategy;
	}

	/**
	 * The extras to be used for dependency injection in all pieces. Returns a reference of [[Store.defaultExtras]].
	 */
	public get context(): PieceContextExtras {
		return Store.injectedContext;
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
		Store.logger?.(`[STORE => ${this.name}] [REGISTER] Registered path '${path}'.`);
		return this;
	}

	/**
	 * Loads one or more pieces from a path.
	 * @param path The path of the file to load.
	 * @return An async iterator that yields each one of the loaded pieces.
	 */
	public async load(path: string): Promise<T[]> {
		const data = this.strategy.filter(path);
		if (data === null) {
			Store.logger?.(`[STORE => ${this.name}] [LOAD] Skipped piece '${path}' as 'LoaderStrategy#filter' returned 'null'.`);
			return [];
		}

		const promises: Promise<T>[] = [];
		for await (const Ctor of this.strategy.load(this, data)) {
			promises.push(this.insert(this.construct(Ctor, data)));
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
	 * Loads all pieces from all directories specified by [[paths]].
	 */
	public async loadAll(): Promise<void> {
		const pieces: T[] = [];

		for (const path of this.paths) {
			for await (const piece of this.loadPath(path)) {
				pieces.push(piece);
			}
		}

		Store.logger?.(`[STORE => ${this.name}] [LOAD-ALL] Found '${pieces.length}' pieces.`);

		// Clear the store before inserting the new pieces:
		this.clear();
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
	 * Constructs a [[Piece]] instance.
	 * @param Ctor The [[Piece]]'s constructor used to build the instance.
	 * @param path The path of the file.
	 * @param name The name of the piece.
	 */
	public construct(Ctor: ILoaderResultEntry<T>, data: ModuleData): T {
		return new Ctor({ store: this, path: data.path, name: data.name }, { name: data.name, enabled: true });
	}

	/**
	 * Loads a directory into the store.
	 * @param directory The directory to load the pieces from.
	 * @return An async iterator that yields the pieces to be loaded into the store.
	 */
	private async *loadPath(directory: string): AsyncIterableIterator<T> {
		Store.logger?.(`[STORE => ${this.name}] [WALK] Loading all pieces from '${directory}'.`);
		for await (const child of this.walk(directory)) {
			const data = this.strategy.filter(child);
			if (data === null) {
				Store.logger?.(`[STORE => ${this.name}] [LOAD] Skipped piece '${child}' as 'LoaderStrategy#filter' returned 'null'.`);
				continue;
			}
			try {
				for await (const Ctor of this.strategy.load(this, data)) {
					yield this.construct(Ctor, data);
				}
			} catch (error) {
				this.strategy.onError(error, data.path);
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
			if (error.code !== 'ENOENT') this.strategy.onError(error, path);
		}
	}

	/**
	 * The injected variables that will be accessible to all stores and pieces. To add an extra property, simply mutate
	 * the object to add it, and this will update all stores and pieces simultaneously.
	 *
	 * @example
	 * ```typescript
	 * // Add a reference to the Client:
	 * import { Store } from '(at)sapphire/pieces';
	 *
	 * export class SapphireClient extends Client {
	 *   constructor(options) {
	 *     super(options);
	 *
	 *     Store.injectedContext.client = this;
	 *   }
	 * }
	 *
	 * // Can be placed anywhere in a TypeScript file, for JavaScript projects,
	 * // you can create an `augments.d.ts` and place the code there.
	 * declare module '(at)sapphire/pieces' {
	 *   interface PieceContextExtras {
	 *     client: SapphireClient;
	 *   }
	 * }
	 *
	 * // In any piece, core, plugin, or custom:
	 * export class UserCommand extends Command {
	 *   public run(message, args) {
	 *     // The injected client is available here:
	 *     const { client } = this.context;
	 *
	 *     // ...
	 *   }
	 * }
	 * ```
	 *
	 * @example
	 * ```typescript
	 * // In a plugin's context, e.g. API:
	 * class Api extends Plugin {
	 *   static [postInitialization]() {
	 *     const server = new Server(this);
	 *     Store.injectedContext.server = server;
	 *
	 *     // ...
	 *   }
	 * }
	 *
	 * declare module '(at)sapphire/pieces' {
	 *   interface PieceContextExtras {
	 *     server: Server;
	 *   }
	 * }
	 *
	 * // In any piece, even those that aren't routes nor middlewares:
	 * export class UserRoute extends Route {
	 *   public [methods.POST](message, args) {
	 *     // The injected server is available here:
	 *     const { server } = this.context;
	 *
	 *     // ...
	 *   }
	 * }
	 * ```
	 */
	public static injectedContext: PieceContextExtras = {};

	/**
	 * The default strategy, defaults to [[LoaderStrategy]], which is constructed on demand when a store is constructed,
	 * when none was set beforehand.
	 */
	public static defaultStrategy: ILoaderStrategy<any> = new LoaderStrategy();

	/**
	 * The default logger, defaults to `null`.
	 */
	public static logger: StoreLogger | null = null;
}
