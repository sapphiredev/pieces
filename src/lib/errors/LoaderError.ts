export enum LoaderErrorType {
	EmptyModule = 'EMPTY_MODULE',
	IncorrectType = 'INCORRECT_TYPE',
	UnknownStore = 'UNKNOWN_STORE',
	UnloadedPiece = 'UNLOADED_PIECE',
	VirtualPiece = 'VIRTUAL_PIECE'
}

/**
 * Describes a loader error with a type for easy identification.
 */
export class LoaderError extends Error {
	/**
	 * The type of the error that was thrown.
	 */
	public readonly type: LoaderErrorType;

	public constructor(type: LoaderErrorType, message: string) {
		super(message);
		this.type = type;
	}

	public override get name() {
		return `${super.name} [${this.type}]`;
	}
}
