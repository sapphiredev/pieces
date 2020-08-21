/**
 * The module data information.
 */
export interface ModuleData {
	/**
	 * The name of the module.
	 */
	name: string;

	/**
	 * The extension of the module.
	 */
	extension: string;
}

/**
 * The result from the filter.
 */
export type FilterResult = ModuleData | null;

/**
 * An abstracted filter interface.
 */
export interface IFilter {
	/**
	 * Retrieves the name and the extension of the specified file path.
	 * @param path The path of the file to be processed.
	 * @return A [[PieceData]] on success, otherwise `null` to stop the store from processing the path.
	 */
	getNameData(path: string): FilterResult;
}
