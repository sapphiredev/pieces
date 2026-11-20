import sapphireEslintConfig from '@sapphire/eslint-config';

export default [
	...sapphireEslintConfig,
	{
		rules: {
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'n/no-sync': 'off'
		}
	}
];
