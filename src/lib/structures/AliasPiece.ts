import { Piece, PieceContext, PieceOptions } from './Piece';

export interface AliasPieceOptions extends PieceOptions {
	/**
	 * The aliases for the piece.
	 * @default []
	 */
	readonly aliases?: readonly string[];
}

/**
 * The piece to be stored in [[AliasStore]] instances.
 */
export class AliasPiece extends Piece {
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
	public toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			aliases: this.aliases.slice()
		};
	}
}
