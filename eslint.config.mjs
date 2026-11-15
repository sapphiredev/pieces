import sapphireEslintConfig from '@sapphire/eslint-config';

export default [
	...sapphireEslintConfig,
	{
		rules: {
			'@stylistic/lines-between-class-members': 'off',
			'@typescript-eslint/consistent-type-exports': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'@typescript-eslint/prefer-function-type': 'off',
			'@typescript-eslint/prefer-readonly': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/sort-type-constituents': 'off',
			'jsdoc/multiline-blocks': 'off',
			'jsdoc/no-undefined-types': 'off',
			'jsdoc/tag-lines': 'off',
			'n/no-sync': 'off',
			'tsdoc/syntax': 'off',
			'typescript-sort-keys/interface': 'off',
			'typescript-sort-keys/string-enum': 'off',
			'unicorn/prefer-export-from': 'off',
			'unicorn/prefer-node-protocol': 'off',
			'unicorn/prefer-optional-catch-binding': 'off'
		}
	}
];
