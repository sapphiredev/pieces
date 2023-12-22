import { join } from 'node:path';
import type { MockInstance } from 'vitest';
import { getRootData, resetRootDataCache, type RootData } from '../../../src/lib/internal/RootScan';

let cwd: MockInstance<[], string>;

afterEach(() => {
	expect(cwd).toHaveBeenCalled();

	cwd.mockRestore();
	resetRootDataCache();
});

describe('RootScan', () => {
	describe('type=commonjs', () => {
		const commonJsBasePath = 'commonjs';

		test('GIVEN type=commonjs && main property THEN returns correct root', () => {
			mockCwd(`${commonJsBasePath}/main`);

			const rootData = getRootData();
			expectRootDataToEqual(rootData, `${commonJsBasePath}/main/dist/lib`, 'CommonJS');
		});

		test('GIVEN type=commonjs && module property THEN returns correct root', () => {
			mockCwd(`${commonJsBasePath}/module`);

			const rootData = getRootData();
			expectRootDataToEqual(rootData, `${commonJsBasePath}/module/dist/lib`, 'CommonJS');
		});
	});

	describe('type=module', () => {
		const moduleBasePath = 'module';

		test('GIVEN type=module && main property THEN returns correct root', () => {
			mockCwd(`${moduleBasePath}/main`);

			const rootData = getRootData();
			expectRootDataToEqual(rootData, `${moduleBasePath}/main/dist/lib`, 'ESM');
		});

		test('GIVEN type=module && module property THEN returns correct root', () => {
			mockCwd(`${moduleBasePath}/module`);

			const rootData = getRootData();
			expectRootDataToEqual(rootData, `${moduleBasePath}/module/dist/lib`, 'ESM');
		});
	});

	describe('no-package', () => {
		const noPackageBasePath = 'no-package';

		test('GIVEN no package.json THEN returns correct root', () => {
			mockCwd(`${noPackageBasePath}/main`);

			const rootData = getRootData();

			expect(rootData).toStrictEqual<RootData>({
				root: `tests/fixtures/${noPackageBasePath}/main`,
				type: 'CommonJS'
			});
		});
	});

	describe('type=undefined', () => {
		const noTypeBasePath = 'no-type';

		test('GIVEN type=undefined && main property THEN returns correct root', () => {
			mockCwd(`${noTypeBasePath}/main`);

			const rootData = getRootData();
			expectRootDataToEqual(rootData, `${noTypeBasePath}/main/dist/lib`, 'CommonJS');
		});

		test('GIVEN type=undefined && module property THEN returns correct root', () => {
			mockCwd(`${noTypeBasePath}/module`);

			const rootData = getRootData();
			expectRootDataToEqual(rootData, `${noTypeBasePath}/module/dist/lib`, 'ESM');
		});
	});
});

function mockCwd(pathForCwd: string) {
	cwd = vi.spyOn(process, 'cwd').mockReturnValue(`tests/fixtures/${pathForCwd}`);
}

function expectRootDataToEqual(actual: RootData, rootPath: string, type: 'ESM' | 'CommonJS') {
	expect(actual).toStrictEqual<RootData>({
		root: join(`tests/fixtures/${rootPath}`),
		type
	});
}
