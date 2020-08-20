import { Piece, PieceContext, PieceOptions } from './Piece';

export interface AliasPieceOptions extends PieceOptions {
	readonly aliases?: readonly string[];
}

export class AliasPiece extends Piece {
	public readonly aliases: readonly string[];
	public constructor(context: PieceContext, options: AliasPieceOptions = {}) {
		super(context, options);
		this.aliases = options.aliases ?? [];
	}
}
