import { isNullish } from '@sapphire/utilities';

function checkProcessArgv(name: string) {
	return (
		process.execArgv.some((arg) => arg.includes(name)) || //
		process.argv.some((arg) => arg.includes(name))
	);
}

function checkPreloadModules(name: string) {
	return '_preload_modules' in process && (process._preload_modules as string[]).some((module) => module.includes(name));
}

function checkEnvVariable(name: string, value?: string) {
	return value ? process.env[name] === value : !isNullish(process.env[name]);
}

/**
 * Whether or not the current environment can load TypeScript files. These
 * conditions are based on the most common tools and runtimes that support
 * loading TypeScript files directly.
 *
 * - {@linkplain https://www.npmjs.com/package/ts-node | `ts-node`}
 * - {@linkplain https://www.npmjs.com/package/ts-node-dev | `ts-node-dev`}
 * - {@linkplain https://www.npmjs.com/package/@babel/node | `@babel/node`}
 * - {@linkplain https://www.npmjs.com/package/vitest | `vitest`}
 * - {@linkplain https://www.npmjs.com/package/jest | `jest`}
 * - {@linkplain https://www.npmjs.com/package/@swc/cli | `swc`}
 * - {@linkplain https://www.npmjs.com/package/tsm | `tsm`}
 * - {@linkplain https://www.npmjs.com/package/esbuild | `esbuild`}
 * - {@linkplain https://www.npmjs.com/package/tsx | `tsx`}
 * - {@linkplain https://deno.com | `Deno`}
 * - {@linkplain https://bun.sh | `Bun`}
 */
export const CanLoadTypeScriptFiles: boolean =
	//
	// Deno
	Reflect.has(globalThis, 'Deno') ||
	//
	// Bun
	Reflect.has(globalThis, 'Bun') ||
	'bun' in process.versions ||
	//
	// ts-node
	// > --require ts-node/register
	Symbol.for('ts-node.register.instance') in process ||
	// > --loader ts-node/esm
	checkProcessArgv('ts-node/esm') ||
	// > ts-node-dev
	!isNullish(process.env.TS_NODE_DEV) ||
	//
	// @babel/node
	checkProcessArgv('babel-node') ||
	//
	// vitest
	checkEnvVariable('VITEST', 'true') ||
	checkEnvVariable('VITEST_WORKER_ID') ||
	//
	// jest
	checkEnvVariable('JEST_WORKER_ID') ||
	//
	// swc
	checkPreloadModules('@swc/register') || //
	checkPreloadModules('@swc-node/register') ||
	checkProcessArgv('.bin/swc-node') ||
	//
	// tsm
	checkPreloadModules('tsm') ||
	//
	// esbuild
	checkPreloadModules('esbuild-register') ||
	//
	// tsx
	checkPreloadModules('tsx');
