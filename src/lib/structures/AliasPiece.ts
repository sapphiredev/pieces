import { Piece } from './Piece';
import type { StoreRegistryEntries } from './StoreRegistry';

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
export class AliasPiece<
	Options extends AliasPieceOptions = AliasPieceOptions,
	StoreName extends keyof StoreRegistryEntries = keyof StoreRegistryEntries
> extends Piece<Options, StoreName> {
	/**
	 * The aliases for the piece.
	 */
	public aliases: readonly string[];

	public constructor(context: Piece.Context, options: AliasPieceOptions = {}) {
		super(context, options);
		this.aliases = options.aliases ?? [];
	}

	/**
	 * Defines the `JSON.stringify` behavior of this alias piece.
	 */
	public override toJSON(): AliasPieceJSON {
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
	export type Context = Piece.Context;
	export type JSON = AliasPieceJSON;
	export type LocationJSON = Piece.LocationJSON;
}
