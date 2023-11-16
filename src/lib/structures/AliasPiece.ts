import { Piece } from './Piece';
import type { StoreRegistryKey } from './StoreRegistry';

export interface AliasPieceOptions extends Piece.Options {
	/**
	 * The aliases for the piece.
	 * @default []
	 */
	readonly aliases?: readonly string[];
}

/**
 * The piece to be stored in {@link AliasStore} instances.
 */
export class AliasPiece<Options extends AliasPieceOptions = AliasPieceOptions, StoreName extends StoreRegistryKey = StoreRegistryKey> extends Piece<
	Options,
	StoreName
> {
	/**
	 * The aliases for the piece.
	 */
	public aliases: readonly string[];

	public constructor(context: AliasPiece.Context, options: AliasPieceOptions = {}) {
		super(context, options);
		this.aliases = options.aliases ?? [];
	}

	/**
	 * Defines the `JSON.stringify` behavior of this alias piece.
	 */
	public override toJSON(): AliasPiece.JSON {
		return {
			...super.toJSON(),
			aliases: this.aliases.slice()
		};
	}
}

/**
 * The return type of {@link AliasPiece.toJSON}.
 */
export interface AliasPieceJSON extends Piece.JSON {
	aliases: string[];
	options: AliasPieceOptions;
}

export namespace AliasPiece {
	export const { Location } = Piece;
	export type Options = AliasPieceOptions;
	export type Context<StoreName extends StoreRegistryKey = StoreRegistryKey> = Piece.Context<StoreName>;
	export type JSON = AliasPieceJSON;
	export type LocationJSON = Piece.LocationJSON;
}
