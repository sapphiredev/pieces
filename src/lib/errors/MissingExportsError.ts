import { LoaderError, LoaderErrorType } from './LoaderError';

/**
 * Describes a [[LoaderErrorType.EmptyModule]] loader error and adds a path for easy identification.
 */
export class MissingExportsError extends LoaderError {
	/**
	 * The path of the module that did not have exports.
	 */
	public readonly path: string;

	public constructor(path: string) {
		super(LoaderErrorType.EmptyModule, `A compatible class export was not found. [${path}]`);
		this.path = path;
	}
}
