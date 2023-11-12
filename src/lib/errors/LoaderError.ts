export enum LoaderErrorType {
	EmptyModule = 'EMPTY_MODULE',
	VirtualPiece = 'VIRTUAL_PIECE',
	UnloadedPiece = 'UNLOADED_PIECE',
	IncorrectType = 'INCORRECT_TYPE',
	UnknownStore = 'UNKNOWN_STORE'
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
