export type Arr = readonly unknown[];
export type Ctor<A extends Arr = readonly any[], R = any> = new (...args: A) => R;

export function isClass(value: unknown): value is Ctor {
	return typeof value === 'function' && typeof value.prototype === 'object';
}

export function classExtends<T extends Ctor>(value: Ctor, base: T): value is T {
	let ctor: Ctor | null = value;
	while (ctor !== null) {
		if (ctor === base) return true;
		ctor = Object.getPrototypeOf(ctor);
	}

	return false;
}
