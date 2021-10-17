import type { Awaitable } from '@sapphire/utilities';
import { container, Container } from '../shared/Container';
import { PieceLocation, PieceLocationJSON } from './PieceLocation';
import type { Store } from './Store';

/**
 * The context for the piece, contains extra information from the store,
 * the piece's path, and the store that loaded it.
 */
export interface PieceContext {
	/**
	 * The root directory the piece was loaded from.
	 */
	readonly root: string;

	/**
	 * The path the module was loaded from, relative to {@link PieceContext.root}.
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
export class Piece<O extends PieceOptions = PieceOptions> {
	/**
	 * The store that contains the piece.
	 */
	public readonly store: Store<Piece>;

	/**
	 * The location metadata for the piece's file.
	 */
	public readonly location: PieceLocation;

	/**
	 * The name of the piece.
	 */
	public readonly name: string;

	/**
	 * Whether or not the piece is enabled.
	 */
	public enabled: boolean;

	/**
	 * The raw options passed to this {@link Piece}
	 */
	public readonly options: O;

	public constructor(context: PieceContext, options: PieceOptions = {}) {
		this.store = context.store;
		this.location = new PieceLocation(context.path, context.root);
		this.name = options.name ?? context.name;
		this.enabled = options.enabled ?? true;
		this.options = options as O;
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
	public onLoad(): Awaitable<unknown> {
		return undefined;
	}

	/**
	 * Per-piece listener that is called when the piece is unloaded from the store.
	 * Useful to set-up clean-up tasks.
	 */
	public onUnload(): Awaitable<unknown> {
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
		await this.store.load(this.location.root, this.location.relative);
	}

	/**
	 * Defines the `JSON.stringify` behavior of this piece.
	 */
	public toJSON(): PieceJSON {
		return {
			location: this.location.toJSON(),
			name: this.name,
			enabled: this.enabled,
			options: this.options
		};
	}
}

/**
 * The return type of {@link Piece.toJSON}.
 */
export interface PieceJSON {
	location: PieceLocationJSON;
	name: string;
	enabled: boolean;
	options: PieceOptions;
}
