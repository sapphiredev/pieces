import { basename, relative, sep } from 'path';
import { VirtualPath } from '../internal/constants';

/**
 * The metadata class used for {@link Piece}s.
 */
export class PieceLocation {
	/**
	 * The full path to the file.
	 */
	public readonly full: string;

	/**
	 * The root directory the file was found from.
	 */
	public readonly root: string;

	/**
	 * @param full The full path to the file.
	 * @param root The root directory the file was found from.
	 */
	public constructor(full: string, root: string) {
		this.full = full;
		this.root = root;
	}

	/**
	 * Whether the file is virtual or not.
	 */
	public get virtual() {
		return this.full === VirtualPath;
	}

	/**
	 * The relative path between {@link PieceLocation.root} and {@link PieceLocation.full}.
	 * @example
	 * ```typescript
	 * const location = new PieceLocation(
	 * 	'/usr/src/app/commands',
	 * 	'/usr/src/app/commands/general/ping.js'
	 * );
	 *
	 * console.log(location.relative);
	 * // → 'general/ping.js'
	 * ```
	 */
	public get relative(): string {
		return this.virtual ? VirtualPath : relative(this.root, this.full);
	}

	/**
	 * The names of the directories that separate {@link PieceLocation.root} and {@link PieceLocation.full}.
	 * @example
	 * ```typescript
	 * const location = new PieceLocation(
	 * 	'/usr/src/app/commands',
	 * 	'/usr/src/app/commands/games/multiplayer/connect-four.js'
	 * );
	 *
	 * console.log(location.directories);
	 * // → ['games', 'multiplayer']
	 * ```
	 */
	public get directories(): string[] {
		return this.virtual ? [] : this.relative.split(sep).slice(0, -1);
	}

	/**
	 * The name and extension of the file that was loaded, extracted from {@link PieceLocation.full}.
	 * @example
	 * ```typescript
	 * const location = new PieceLocation(
	 * 	'/usr/src/app/commands',
	 * 	'/usr/src/app/commands/games/multiplayer/connect-four.js'
	 * );
	 *
	 * console.log(location.name);
	 * // → 'connect-four.js'
	 * ```
	 */
	public get name(): string {
		return this.virtual ? VirtualPath : basename(this.full);
	}

	/**
	 * Defines the `JSON.stringify` behavior of this structure.
	 */
	public toJSON(): PieceLocationJSON {
		return {
			directories: this.directories,
			full: this.full,
			name: this.name,
			relative: this.relative,
			root: this.root
		};
	}
}

/**
 * The return type of {@link PieceLocation.toJSON}.
 */
export interface PieceLocationJSON {
	directories: string[];
	full: string;
	name: string;
	relative: string;
	root: string;
}
