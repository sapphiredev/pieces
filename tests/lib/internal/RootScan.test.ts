import { join } from 'node:path';
import type { MockInstance } from 'vitest';
import { parseRootData, type RootData } from '../../../src/lib/internal/RootScan';

let cwd: MockInstance<[], string>;

afterEach(() => {
	expect(cwd).toHaveBeenCalled();

	cwd.mockRestore();
});

describe('RootScan', () => {
	describe('type=commonjs', () => {
		const commonJsBasePath = 'commonjs';

		test('GIVEN type=commonjs && main property THEN returns correct root', () => {
			mockCwd(commonJsBasePath, 'main');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'CommonJS', commonJsBasePath, 'main', 'dist', 'lib');
		});

		test('GIVEN type=commonjs && module property THEN returns correct root', () => {
			mockCwd(commonJsBasePath, 'module');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'CommonJS', commonJsBasePath, 'module', 'dist', 'lib');
		});
	});

	describe('type=module', () => {
		const moduleBasePath = 'module';

		test('GIVEN type=module && main property THEN returns correct root', () => {
			mockCwd(moduleBasePath, 'main');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'ESM', moduleBasePath, 'main', 'dist', 'lib');
		});

		test('GIVEN type=module && module property THEN returns correct root', () => {
			mockCwd(moduleBasePath, 'module');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'ESM', moduleBasePath, 'module', 'dist', 'lib');
		});
	});

	describe('no-package', () => {
		const noPackageBasePath = 'no-package';

		test('GIVEN no package.json THEN returns correct root', () => {
			mockCwd(noPackageBasePath);

			const rootData = parseRootData();

			expect(rootData).toStrictEqual<RootData>({
				root: testsFixturesJoin(noPackageBasePath),
				type: 'CommonJS'
			});
		});
	});

	describe('type=undefined', () => {
		const noTypeBasePath = 'no-type';

		test('GIVEN type=undefined && main property THEN returns correct root', () => {
			mockCwd(noTypeBasePath, 'main');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'CommonJS', noTypeBasePath, 'main', 'dist', 'lib');
		});

		test('GIVEN type=undefined && module property THEN returns correct root', () => {
			mockCwd(noTypeBasePath, 'module');

			const rootData = parseRootData();
			expectRootDataToEqual(rootData, 'ESM', noTypeBasePath, 'module', 'dist', 'lib');
		});
	});
});

/**
 * Mocks the current working directory by setting the return value of `process.cwd()` to the joined path of the provided arguments.
 *
 * @param pathForCwd - The path segments to join and set as the current working directory.
 */
function mockCwd(...pathForCwd: string[]) {
	cwd = vi.spyOn(process, 'cwd').mockReturnValue(testsFixturesJoin(...pathForCwd));
}

/**
 * Asserts that the actual RootData object is equal to the expected RootData object.
 * @param actual - The actual RootData object.
 * @param type - The type of the RootData object ('ESM' or 'CommonJS').
 * @param rootPath - The root path of the RootData object.
 */
function expectRootDataToEqual(actual: RootData, type: 'ESM' | 'CommonJS', ...rootPath: string[]) {
	expect(actual).toStrictEqual<RootData>({
		root: testsFixturesJoin(...rootPath),
		type
	});
}

/**
 * Joins the given path segments with 'tests/fixtures' and returns the resulting path.
 *
 * @param path - The path segments to join.
 * @returns The joined path.
 */
function testsFixturesJoin(...path: string[]) {
	return join('tests', 'fixtures', ...path);
}
