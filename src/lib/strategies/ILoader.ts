import type { Piece, PieceContext, PieceOptions } from '../Piece';
import type { Store } from '../Store';

export interface IPiece<T extends Piece> {
	new (context: PieceContext, options?: PieceOptions): T;
}

export interface ILoader {
	onLoad<T extends Piece>(store: Store<T>, path: string): AsyncIterableIterator<IPiece<T>>;
}
