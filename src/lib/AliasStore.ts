import Collection from '@discordjs/collection';
import type { AliasPiece } from './AliasPiece';
import { Store } from './Store';

export class AliasStore<T extends AliasPiece> extends Store<T> {
	public readonly aliases = new Collection<string, T>();
	public unload(name: string | T): T {
		const piece = this.resolve(name);

		// Unload all aliases for the given piece:
		for (const alias of piece.aliases) {
			// We don't want to delete aliases that were overriden by another piece:
			const aliasPiece = this.aliases.get(alias);
			if (aliasPiece === piece) this.aliases.delete(alias);
		}

		return super.unload(piece);
	}

	protected insert(piece: T) {
		const previous = this.get(piece.name);
		if (previous) this.unload(previous);

		for (const key of piece.aliases) {
			this.aliases.set(key, piece);
		}

		return super.insert(piece);
	}
}
