import { Piece, PieceContext, PieceJSON, PieceOptions } from './Piece';

export interface AliasPieceOptions extends PieceOptions {
	/**
	 * The aliases for the piece.
	 * @default []
	 */
	readonly aliases?: readonly string[];
}

/**
 * The piece to be stored in {@link AliasStore} instances.
 */
export class AliasPiece<O extends AliasPieceOptions = AliasPieceOptions> extends Piece<O> {
	/**
	 * The aliases for the piece.
	 */
	public aliases: readonly string[];

	public constructor(context: PieceContext, options: AliasPieceOptions = {}) {
		super(context, options);
		this.aliases = options.aliases ?? [];
	}

	/**
	 * Defines the `JSON.stringify` behavior of this alias piece.
	 */
	public toJSON(): AliasPieceJSON {
		return {
			...super.toJSON(),
			aliases: this.aliases.slice()
		};
	}
}

/**
 * The return type of {@link AliasPiece.toJSON}.
 */
export interface AliasPieceJSON extends PieceJSON {
	aliases: string[];
	options: AliasPieceOptions;
}

export namespace AliasPiece {
	export type Options = AliasPieceOptions;
	export type Context = PieceContext;
	export type JSON = AliasPieceJSON;
}
