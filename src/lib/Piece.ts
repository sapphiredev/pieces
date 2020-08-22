import type { Store } from './Store';

/**
 * Represents the data from [[PieceContext.extras]] and may be used for dependency injection.
 * Libraries can provide strict typing by augmenting this module, check
 * {@link https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation module augmentation}
 * for more information.
 */
export interface PieceContextExtras extends Record<PropertyKey, unknown> {}

/**
 * The context for the piece, contains extra information from the store,
 * the piece's path, and the store that loaded it.
 */
export interface PieceContext {
	/**
	 * The extra information for the piece.
	 */
	readonly extras: PieceContextExtras;

	/**
	 * The path the piece was loaded from.
	 */
	readonly path: string;

	/**
	 * The store that loaded the piece.
	 */
	readonly store: Store<Piece>;
}

/**
 * The options for the [[Piece]].
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
 * The piece to be stored in [[Store]] instances.
 */
export class Piece {
	/**
	 * The extra given by the store or by the user.
	 */
	public readonly extras: PieceContextExtras;

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
		this.extras = context.extras;
		this.store = context.store;
		this.path = context.path;
		this.name = options.name ?? '';
		this.enabled = options.enabled ?? true;
	}

	public toJSON(): Record<string, any> {
		return {
			path: this.path,
			name: this.name,
			enabled: this.enabled
		};
	}
}
