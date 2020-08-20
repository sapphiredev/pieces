export interface PieceContext {
	context: unknown;
	path: string;
}

export interface PieceOptions {
	name?: string;
	enabled?: boolean;
}

export class Piece {
	public readonly context: unknown;
	public readonly path: string;
	public readonly name: string;
	public enabled: boolean;

	public constructor(context: PieceContext, options: PieceOptions = {}) {
		this.context = context.context;
		this.path = context.path;
		this.name = options.name ?? '';
		this.enabled = options.enabled ?? true;
	}
}
