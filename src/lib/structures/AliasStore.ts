import { Collection } from '@discordjs/collection';
import type { AliasPiece } from './AliasPiece';
import { Store } from './Store';

/**
 * The store class which contains {@link AliasPiece}s.
 */
export class AliasStore<T extends AliasPiece> extends Store<T> {
	/**
	 * The aliases referencing to pieces.
	 */
	public readonly aliases = new Collection<string, T>();

	/**
	 * Looks up the name by the store, falling back to an alias lookup.
	 * @param key The key to look for.
	 */
	public override get(key: string): T | undefined {
		return super.get(key) ?? this.aliases.get(key);
	}

	/**
	 * Checks whether a key is in the store, or is an alias
	 * @param key The key to check
	 */
	public override has(key: string): boolean {
		return super.has(key) || this.aliases.has(key);
	}

	/**
	 * Unloads a piece given its instance or its name, and removes all the aliases.
	 * @param name The name of the file to load.
	 * @return Returns the piece that was unloaded.
	 */
	public override unload(name: string | T): Promise<T> {
		const piece = this.resolve(name);

		// Unload all aliases for the given piece:
		for (const alias of piece.aliases) {
			// We don't want to delete aliases that were overriden by another piece:
			const aliasPiece = this.aliases.get(alias);
			if (aliasPiece === piece) this.aliases.delete(alias);
		}

		return super.unload(piece);
	}

	/**
	 * Inserts a piece into the store, and adds all the aliases.
	 * @param piece The piece to be inserted into the store.
	 * @return The inserted piece.
	 */
	public override async insert(piece: T) {
		for (const key of piece.aliases) {
			this.aliases.set(key, piece);
		}

		return super.insert(piece);
	}
}
