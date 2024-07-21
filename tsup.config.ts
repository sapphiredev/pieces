import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { defineConfig, type Options } from 'tsup';

const baseOptions: Options = {
	clean: true,
	entry: ['src/**'],
	dts: true,
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2021',
	tsconfig: 'src/tsconfig.json',
	keepNames: true,
	esbuildPlugins: [esbuildPluginFilePathExtensions()],
	treeshake: true
};

export default [
	defineConfig({
		...baseOptions,
		outDir: 'dist/cjs',
		format: 'cjs',
		outExtension: () => ({ js: '.cjs' })
	}),
	defineConfig({
		...baseOptions,
		outDir: 'dist/esm',
		format: 'esm'
	})
];
