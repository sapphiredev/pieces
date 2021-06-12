import { container, Container } from '../shared/Container';
import type { Awaited } from '../strategies/ILoaderStrategy';
import type { Store } from './Store';

/**
 * The context for the piece, contains extra information from the store,
 * the piece's path, and the store that loaded it.
 */
export interface PieceContext {
	/**
	 * The path the module was loaded from.
	 */
	readonly path: string;

	/**
	 * The module's name extracted from the path.
	 */
	readonly name: string;

	/**
	 * The store that loaded the piece.
	 */
	readonly store: Store<Piece>;
}

/**
 * The options for the {@link Piece}.
 */
export interface PieceOptions {
	/**
	 * The name for the piece.
	 * @default ''
	 */
	readonly name?: string;

	/**
	 * Whether or not the piece should be enabled. If set to false, the piece will be unloaded.
	 * @default true
	 */
	readonly enabled?: boolean;
}

/**
 * The piece to be stored in {@link Store} instances.
 */
export class Piece {
	/**
	 * The store that contains the piece.
	 */
	public readonly store: Store<Piece>;

	/**
	 * The path to the piece's file.
	 */
	public readonly path: string;

	/**
	 * The name of the piece.
	 */
	public readonly name: string;

	/**
	 * Whether or not the piece is enabled.
	 */
	public enabled: boolean;

	public constructor(context: PieceContext, options: PieceOptions = {}) {
		this.store = context.store;
		this.path = context.path;
		this.name = options.name ?? context.name;
		this.enabled = options.enabled ?? true;
	}

	/**
	 * A reference to the {@link Container} object for ease of use.
	 * @see container
	 */
	public get container(): Container {
		return container;
	}

	/**
	 * Per-piece listener that is called when the piece is loaded into the store.
	 * Useful to set-up asynchronous initialization tasks.
	 */
	public onLoad(): Awaited<unknown> {
		return undefined;
	}

	/**
	 * Per-piece listener that is called when the piece is unloaded from the store.
	 * Useful to set-up clean-up tasks.
	 */
	public onUnload(): Awaited<unknown> {
		return undefined;
	}

	/**
	 * Unloads and disables the piece.
	 */
	public async unload() {
		await this.store.unload(this.name);
		this.enabled = false;
	}

	/**
	 * Reloads the piece by loading the same path in the store.
	 */
	public async reload() {
		await this.store.load(this.path);
	}

	/**
	 * Defines the `JSON.stringify` behavior of this piece.
	 */
	public toJSON(): Record<string, any> {
		return {
			path: this.path,
			name: this.name,
			enabled: this.enabled
		};
	}
}
