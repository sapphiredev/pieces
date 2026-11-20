import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	entry: ['src/**/*.ts'],
	dts: true,
	minify: false,
	deps: { neverBundle: true },
	format: ['esm'],
	outDir: 'dist',
	outExtensions: () => ({ js: '.mjs', dts: '.d.mts' }),
	sourcemap: true,
	target: 'es2024',
	tsconfig: 'src/tsconfig.json',
	unbundle: true,
	treeshake: true
});
