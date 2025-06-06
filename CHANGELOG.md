# Changelog

All notable changes to this project will be documented in this file.

# [4.4.1](https://github.com/sapphiredev/pieces/compare/v4.4.0...v4.4.1) - (2025-06-06)

## 🐛 Bug Fixes

- **loader:** Check if Bun is used by checking `globalThis.Bun` ([386a910](https://github.com/sapphiredev/pieces/commit/386a910da1a901648d6c963ef6f477bcaff8a7b3))

# [4.4.0](https://github.com/sapphiredev/pieces/compare/v4.3.2...v4.4.0) - (2025-05-12)

## 🚀 Features

- Update @discordjs/collection to v2 ([b5ccdf7](https://github.com/sapphiredev/pieces/commit/b5ccdf7be2f15c4c7c63361cecb5a534cce652ad))

# [4.3.2](https://github.com/sapphiredev/pieces/compare/v4.3.1...v4.3.2) - (2025-04-06)

## 🐛 Bug Fixes

- **RootScan:** Check for runtime config files when checking for CJS vs ESM ([304aa72](https://github.com/sapphiredev/pieces/commit/304aa72727bd0d1e69960b4cc0c76b95fbcfbfa6)) ([#476](https://github.com/sapphiredev/pieces/pull/476) by @favna)
- **deps:** Update all non-major dependencies ([6bd70d4](https://github.com/sapphiredev/pieces/commit/6bd70d4d8bf8bbaa61ed4ffa56c8faa86e50f27d)) ([#463](https://github.com/sapphiredev/pieces/pull/463) by @renovate[bot])
- **deps:** Update all non-major dependencies ([27504b7](https://github.com/sapphiredev/pieces/commit/27504b7893d61c33b4903018dc6f633b5f3490d7)) ([#445](https://github.com/sapphiredev/pieces/pull/445) by @renovate[bot])
- **deps:** Update all non-major dependencies ([3a9d08d](https://github.com/sapphiredev/pieces/commit/3a9d08d5c30d14b2fe3df3d04110faa6564c30d8)) ([#442](https://github.com/sapphiredev/pieces/pull/442) by @renovate[bot])

# [4.3.1](https://github.com/sapphiredev/pieces/compare/v4.3.0...v4.3.1) - (2024-07-01)

## 🐛 Bug Fixes

- Fixed checking for tsx support ([3e3a404](https://github.com/sapphiredev/pieces/commit/3e3a4047b251c5a36c9219712ffe0034a2ab663d)) ([#416](https://github.com/sapphiredev/pieces/pull/416) by @AhsokaT)

# [4.3.0](https://github.com/sapphiredev/pieces/compare/v4.2.2...v4.3.0) - (2024-06-30)

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies ([5dad3e5](https://github.com/sapphiredev/pieces/commit/5dad3e5629c1be0409e312d47088d6a8e641312e)) ([#407](https://github.com/sapphiredev/pieces/pull/407) by @renovate[bot])

## 📝 Documentation

- **container:** Fix incorrect function name in tsdoc ([d58e5d5](https://github.com/sapphiredev/pieces/commit/d58e5d55593d335c8adbd8ce7b41a6a5b7579198))

## 🚀 Features

- Check for more environments for TS support ([d8c7a6d](https://github.com/sapphiredev/pieces/commit/d8c7a6d4f9f90fabe6b8cdc68e0ed28f0b5de1e4)) ([#415](https://github.com/sapphiredev/pieces/pull/415) by @kyranet)

# [4.2.2](https://github.com/sapphiredev/pieces/compare/v4.2.2...v4.2.2) - (2024-01-19)

## 🐛 Bug Fixes

- Update transitive sapphire dependencies ([78d8198](https://github.com/sapphiredev/pieces/commit/78d819896c96ea74ff81b92118dc0477c01de9dc))
- Fixed commonjs typings export mapping (#377) ([b115413](https://github.com/sapphiredev/pieces/commit/b115413c972be54c7ed131d29a53587a5fc9c8a7))
- Make virtual pieces respect name restrictions like normal pieces (#374) ([fcca114](https://github.com/sapphiredev/pieces/commit/fcca1149d09f3e1ca79feef37de4b57af2e1c3fe))

# [4.2.1](https://github.com/sapphiredev/pieces/compare/v4.2.1...v4.2.1) - (2024-01-12)

## 🐛 Bug Fixes

- Add deno to the filters for loading TS files (#373) ([6ba9dc5](https://github.com/sapphiredev/pieces/commit/6ba9dc5431ad6e8788685d7d5c31752af34c7548))
- **deps:** Update all non-major dependencies ([0c68396](https://github.com/sapphiredev/pieces/commit/0c68396fd5c8a9e03f0c6d14ab1f2ec8d235ed5c))

# [4.2.0](https://github.com/sapphiredev/pieces/compare/v4.2.0...v4.2.0) - (2023-12-27)

## 🚀 Features

- **RootScan:** Ensure RootScan also scans `module` fields in package.json (#369) ([7eb28a9](https://github.com/sapphiredev/pieces/commit/7eb28a976f9ddb3cd596805977cb78b0eacb394c))

# [4.1.0](https://github.com/sapphiredev/pieces/compare/v4.1.0...v4.1.0) - (2023-12-09)

## 🚀 Features

-   Bun (#359) ([2f862f4](https://github.com/sapphiredev/pieces/commit/2f862f4d4d9a7c569118795db7d432fc3971a939))

# [4.0.2](https://github.com/sapphiredev/pieces/compare/v4.0.2...v4.0.2) - (2023-12-05)

## 🐛 Bug Fixes

-   Properly package all files in dist for npm ([2faab8a](https://github.com/sapphiredev/pieces/commit/2faab8af9c604a6062ab078a34e4aba8ac92cc80))

# [4.0.1](https://github.com/sapphiredev/pieces/compare/v4.0.1...v4.0.1) - (2023-12-05)

## 🐛 Bug Fixes

-   Bump transitive dependencies ([1da0283](https://github.com/sapphiredev/pieces/commit/1da0283459b0be9b2fa4ef5773dfa5616a95aec6))

# [4.0.0](https://github.com/sapphiredev/pieces/compare/v4.0.0...v4.0.0) - (2023-12-04)

## 🏠 Refactor

-   Move `walk` to `ILoaderStrategy` (#352) ([540ac88](https://github.com/sapphiredev/pieces/commit/540ac884632b8c72d17aa4b422dfeb372ce743ed))

## 🐛 Bug Fixes

-   Properly split CJS and ESM ([41e8cec](https://github.com/sapphiredev/pieces/commit/41e8cec3c3b9ce1f91009d932a2a59fe0b42a6ac))
    -   💥 **BREAKING CHANGE:** This ensures that Pieces will properly load the files
        from the appropiate folder and we properly bundle CJS and ESM.
        To use this version of @sapphire/pieces you have to use @sapphire/framework
        v5.x or higher, or update your own usage of @sapphire/pieces to also
        properly split ESM and CJS.

# [3.10.0](https://github.com/sapphiredev/pieces/compare/v3.10.0...v3.10.0) - (2023-11-16)

## 🏠 Refactor

-   Rename `Piece.Context` to `Piece.LoaderContext` (#351) ([f5bb225](https://github.com/sapphiredev/pieces/commit/f5bb22508850e1aead0b7fadc802ac13e462dca4))

## 🚀 Features

-   Use `StoreName` for improved type experience (#350) ([3c722ef](https://github.com/sapphiredev/pieces/commit/3c722ef2d57bc292920491a990cd91dddefc37bd))
-   **StoreRegistry:** Add `StoreOf` and `PieceOf` (#349) ([7b0ae1d](https://github.com/sapphiredev/pieces/commit/7b0ae1dba0e51084d35c3801e8c25c6d1dc3a54f))

# [3.9.0](https://github.com/sapphiredev/pieces/compare/v3.9.0...v3.9.0) - (2023-11-15)

## 🚀 Features

-   Revert 12be6ba006d549ba2250546b4fb3c35a9e5d25f2 "add symbol support for piece names (#346)" ([9424c20](https://github.com/sapphiredev/pieces/commit/9424c2020ab4a37c4db97d382f90e1bb8890b19f))

# [3.8.0](https://github.com/sapphiredev/pieces/compare/v3.8.0...v3.8.0) - (2023-11-15)

## 🐛 Bug Fixes

-   **AliasStore:** Pass `StoreName` type parameter to `Store` (#347) ([9a3492c](https://github.com/sapphiredev/pieces/commit/9a3492c963311296b4eb82119ef926c89e277cca))

## 🚀 Features

-   Add symbol support for piece names (#346) ([12be6ba](https://github.com/sapphiredev/pieces/commit/12be6ba006d549ba2250546b4fb3c35a9e5d25f2))
-   **StoreRegistry:** Add queue and virtual file support (#344) ([b7c0839](https://github.com/sapphiredev/pieces/commit/b7c0839cd8d562d9762bf4f13af080eb52db99de))

# [3.7.1](https://github.com/sapphiredev/pieces/compare/v3.7.1...v3.7.1) - (2023-11-13)

## 🐛 Bug Fixes

-   **LoaderStrategy:** Overload empty methods for extensions (#345) ([2a971d8](https://github.com/sapphiredev/pieces/commit/2a971d8105f5215cf334cc55f9ddc894959f3907))
-   **deps:** Update all non-major dependencies (#325) ([df91def](https://github.com/sapphiredev/pieces/commit/df91def34495165af80d0f07881c2876860e4f22))
-   **deps:** Update all non-major dependencies (#321) ([9106543](https://github.com/sapphiredev/pieces/commit/9106543e78c695a8d1d14de369875ac7baba3f6f))

# [3.7.0](https://github.com/sapphiredev/pieces/compare/v3.6.3...v3.7.0) - (2023-07-21)

## 🐛 Bug Fixes

-   Update sapphire utilities to v3.13.0 ([21e9e6d](https://github.com/sapphiredev/pieces/commit/21e9e6da00642d114f3cc1cbd188719027c8537b))
-   Resolve issue with class extends utility (#314) ([1501fc1](https://github.com/sapphiredev/pieces/commit/1501fc1cde72d434b4a64f47d34b5903dde4171e))
-   **deps:** Update all non-major dependencies (#303) ([cb6ddde](https://github.com/sapphiredev/pieces/commit/cb6ddde1aeb7867b9fcf9c321f80d1f2812b5cd0))

## 🚀 Features

-   Omit files starting with `_` from loading (#289) ([b8a2688](https://github.com/sapphiredev/pieces/commit/b8a2688bcbbe7abb23a53522a94f91e32e3eee61))

# [3.6.2](https://github.com/sapphiredev/pieces/compare/v3.6.1...v3.6.2) - (2023-04-10)

## 🐛 Bug Fixes

-   Explicitly import tslib ([c433c5b](https://github.com/sapphiredev/pieces/commit/c433c5ba8bbb2d549ac7943a5438dc672e6ef873))
-   Use TypeScript v5 ([2bea7b4](https://github.com/sapphiredev/pieces/commit/2bea7b42cf837b7cb19d59bec559b95913cf5009))

# [3.6.1](https://github.com/sapphiredev/pieces/compare/v3.6.0...v3.6.1) - (2023-03-17)

## 🐛 Bug Fixes

-   **LoaderError:** Changed `LoaderErrorType` from `const enum` to just `enum` ([7e23deb](https://github.com/sapphiredev/pieces/commit/7e23deb5188aca1db3fcf38c373d424119711ccf))
-   **deps:** Update all non-major dependencies (#276) ([5b3b7b6](https://github.com/sapphiredev/pieces/commit/5b3b7b6036b2afa0d91500bf255d04cea8997b48))

# [3.6.0](https://github.com/sapphiredev/pieces/compare/v3.5.2...v3.6.0) - (2022-10-31)

## 🐛 Bug Fixes

-   **deps:** Update all non-major dependencies (#257) ([cd043b8](https://github.com/sapphiredev/pieces/commit/cd043b8808b9649ee4b8f4079d89acbc287c4009))
-   **deps:** Update dependency @sapphire/utilities to ^3.11.0 (#258) ([ab31a5e](https://github.com/sapphiredev/pieces/commit/ab31a5e7336e2e2163c1a9d2c04a7df365886f5f))

## 📝 Documentation

-   Add qyurila as a contributor for code (#271) ([4a30034](https://github.com/sapphiredev/pieces/commit/4a30034ab8a27eebedfc48d5e4cad7b99fd3df50))

## 🚀 Features

-   Support loading ESModule TS files when using ts-node (#270) ([bf58baa](https://github.com/sapphiredev/pieces/commit/bf58baadc3684ea05da4a10bea228f46ab44738d))

# [3.5.2](https://github.com/sapphiredev/pieces/compare/v3.5.1...v3.5.2) - (2022-10-02)

## 🐛 Bug Fixes

-   Update @sapphire/utilities dependency ([e326143](https://github.com/sapphiredev/pieces/commit/e3261436adb2d895b1327b9510842f081a7530b9))
-   **deps:** Update dependency @sapphire/utilities to ^3.9.3 (#243) ([0315d4e](https://github.com/sapphiredev/pieces/commit/0315d4e8a7865442a36b1caee7748ee948894a63))

## 📝 Documentation

-   Add RealShadowNova as a contributor for tool (#239) ([44e767d](https://github.com/sapphiredev/pieces/commit/44e767d3dc833cb815086fdb96435ed347eeee9e))

# [3.5.1](https://github.com/sapphiredev/pieces/compare/v3.5.0...v3.5.1) - (2022-08-20)

## 🐛 Bug Fixes

-   Update dependencies ([7707d0a](https://github.com/sapphiredev/pieces/commit/7707d0ae880a99249d4fafde435c0b2529c67349))
-   Bump dependencies ([e4fced2](https://github.com/sapphiredev/pieces/commit/e4fced2ef28acd4d3a14b63efd5c85c5067416ce))

## 📝 Documentation

-   Add @leonardssh as a contributor ([65787a1](https://github.com/sapphiredev/pieces/commit/65787a187822962afed3a412f1eb9ce3a7575318))

# [3.5.0](https://github.com/sapphiredev/pieces/compare/v3.4.1...v3.5.0) - (2022-08-05)

## 🚀 Features

-   **esm:** Add more qs parameters (#232) ([5c44377](https://github.com/sapphiredev/pieces/commit/5c4437734dcd2e421434505d1fddb6d8dd3816a2))

# [3.4.1](https://github.com/sapphiredev/pieces/compare/v3.4.0...v3.4.1) - (2022-08-04)

## 🐛 Bug Fixes

-   **deps:** Update dependency @sapphire/utilities to ^3.9.0 ([41bc4a9](https://github.com/sapphiredev/pieces/commit/41bc4a9bc358aca895923867434c1a335a667b31))

# [3.4.0](https://github.com/sapphiredev/pieces/compare/v3.3.5...v3.4.0) - (2022-08-04)

## 🐛 Bug Fixes

-   **store:** Support abstract classes (#230) ([f83a05d](https://github.com/sapphiredev/pieces/commit/f83a05d616f223548951b9b3db6b44301dd5d65a))
-   **deps:** Update dependency @sapphire/utilities to ^3.8.0 (#229) ([388cc37](https://github.com/sapphiredev/pieces/commit/388cc37d80670b6a64529b4dc2422dfbfc8bae6b))
-   **deps:** Update all non-major dependencies (#228) ([ca39767](https://github.com/sapphiredev/pieces/commit/ca3976790d06e74ef17eba6adde6c1f903b0a8dc))

## 🚀 Features

-   Add URL support for register methods (#231) ([3d2d1be](https://github.com/sapphiredev/pieces/commit/3d2d1befd99ec0ccaaf3ea5ce6b03568b0ec5d2c))

# [3.3.5](https://github.com/sapphiredev/pieces/compare/v3.3.4...v3.3.5) - (2022-07-24)

## 🐛 Bug Fixes

-   Fixed imports of discordjs/colletion to resolve type issues ([cfc8a5c](https://github.com/sapphiredev/pieces/commit/cfc8a5c10744979b7660c3b63b07364c9bedd24d))
-   **deps:** Update dependency @sapphire/utilities to ^3.7.0 (#219) ([488afd3](https://github.com/sapphiredev/pieces/commit/488afd3689767505eb994759380125ae7b1b936d))

# [3.3.3](https://github.com/sapphiredev/pieces/compare/v3.3.1...v3.3.3) - (2022-05-15)

## 🏠 Refactor

-   Stricter types ([f9be533](https://github.com/sapphiredev/pieces/commit/f9be53361bd6fdf7039bd605c3ebcd177d196432))

## 🐛 Bug Fixes

-   **deps:** Update all non-major dependencies (#190) ([299ffa9](https://github.com/sapphiredev/pieces/commit/299ffa9dfaa2178f57d8395b900fcf380e2240ff))

## 📝 Documentation

-   Add @r-priyam as a contributor ([edf13b0](https://github.com/sapphiredev/pieces/commit/edf13b0563299fc461ff2c7419ca0c7c30e5da81))
-   Add @leonardssh as a contributor ([d6d9d00](https://github.com/sapphiredev/pieces/commit/d6d9d0016a2e2aad27595f4cc8f64eabb46c4024))

### [3.3.1](https://github.com/sapphiredev/pieces/compare/v3.3.0...v3.3.1) (2022-04-01)

### Bug Fixes

-   bump sapphire utilities dependency ([a36c8c8](https://github.com/sapphiredev/pieces/commit/a36c8c8a9e1e7cb12c0fa3c7c7399233c7f91b37))

## [3.3.0](https://github.com/sapphiredev/pieces/compare/v3.2.0...v3.3.0) (2022-03-06)

### Features

-   allow module: NodeNext ([#170](https://github.com/sapphiredev/pieces/issues/170)) ([9677524](https://github.com/sapphiredev/pieces/commit/9677524519ec149744dd5df7c977a82c39049067))

### Bug Fixes

-   **deps:** update all non-major dependencies ([#151](https://github.com/sapphiredev/pieces/issues/151)) ([ef9c11f](https://github.com/sapphiredev/pieces/commit/ef9c11fd5ada72067ecdc7e2aa2df4a927e24d71))
-   **deps:** update all non-major dependencies ([#161](https://github.com/sapphiredev/pieces/issues/161)) ([b69734d](https://github.com/sapphiredev/pieces/commit/b69734da03f40e4a4d59db464db945867cb0b6aa))

## [3.2.0](https://github.com/sapphiredev/pieces/compare/v3.1.1...v3.2.0) (2021-11-21)

### Features

-   add Piece and Store namespaces for easier importing types ([#138](https://github.com/sapphiredev/pieces/issues/138)) ([84e2d24](https://github.com/sapphiredev/pieces/commit/84e2d243622f76251c68ac26465b5f47571a857c))

### Bug Fixes

-   remove unsupported yarn flag ([#137](https://github.com/sapphiredev/pieces/issues/137)) ([b9a6d07](https://github.com/sapphiredev/pieces/commit/b9a6d079e1d2d9d2b567e3f59d7effb08fe84324))

### [3.1.1](https://github.com/sapphiredev/pieces/compare/v3.1.0...v3.1.1) (2021-11-06)

### Bug Fixes

-   **deps:** update all non-major dependencies ([#132](https://github.com/sapphiredev/pieces/issues/132)) ([7b19018](https://github.com/sapphiredev/pieces/commit/7b190185b31a4d892a0e8589667733993e3b570c))
-   **deps:** update dependency @sapphire/utilities to ^3.0.6 ([#131](https://github.com/sapphiredev/pieces/issues/131)) ([b0b1bea](https://github.com/sapphiredev/pieces/commit/b0b1bea86ac6cc2071093b82016a6e372b482e7f))

## [3.1.0](https://github.com/sapphiredev/pieces/compare/v3.0.1...v3.1.0) (2021-10-17)

### Features

-   **piece:** add `options` field to read raw options ([#127](https://github.com/sapphiredev/pieces/issues/127)) ([e994d8c](https://github.com/sapphiredev/pieces/commit/e994d8cef03f1492411c82385bfe3a2f46468210))

### Bug Fixes

-   allow more node & npm versions in engines field ([8ce9b52](https://github.com/sapphiredev/pieces/commit/8ce9b52f0bf739a0420e32a86a8cf249d12d6b6f))
-   filter `.d.ts` files from default loader strategy ([#128](https://github.com/sapphiredev/pieces/issues/128)) ([0a7c4ac](https://github.com/sapphiredev/pieces/commit/0a7c4ac0d3f8bc804a50d10ea1f1bffa72c4ac48))

### [3.0.1](https://github.com/sapphiredev/pieces/compare/v3.0.0...v3.0.1) (2021-10-04)

### Bug Fixes

-   change `Awaited` to `Awaitable` ([f1f9c1b](https://github.com/sapphiredev/pieces/commit/f1f9c1bbdee697eb9ee0abf8438fc011f1e218ad))
-   resolve incorrect ESM bundle exports ([44f6b5f](https://github.com/sapphiredev/pieces/commit/44f6b5f0c51d738b11935ff8a4a1df4b361996ff))
-   set dependencies to latest versions ([e34af9f](https://github.com/sapphiredev/pieces/commit/e34af9f5ecebe8b773808a233c1263809447a7c8))

## [3.0.0](https://github.com/sapphiredev/pieces/compare/v2.2.0...v3.0.0) (2021-09-09)

### ⚠ BREAKING CHANGES

-   Changed `Store#load` to take `root` and `path`
-   Make `ILoaderStrategy#load` take `HydratedModuleData`
-   Remove `Piece#path`, use `#location` instead

### Features

-   **AliasPiece:** strict type `toJSON()` ([4aead0d](https://github.com/sapphiredev/pieces/commit/4aead0d309497e14b30b58ba064572ea21d0171e))
-   **ILoaderStrategy:** Added `HydratedModuleData` type ([8ea5303](https://github.com/sapphiredev/pieces/commit/8ea5303381483a9e4969bbe6f554428621c4470f))
-   **Piece:** added `location` property, containing the file's metadata ([27a5488](https://github.com/sapphiredev/pieces/commit/27a5488abf3983b992806bed346328df2d38713c))
-   **Piece:** strict type `toJSON()` ([6f9f0a6](https://github.com/sapphiredev/pieces/commit/6f9f0a610c9e9f0b0395b582703f31c77c165b1b))
-   added `PieceLocation` ([e1c1ff9](https://github.com/sapphiredev/pieces/commit/e1c1ff95a61bfab8e467f5fd1dbda3f40fefa173))
-   update to V3 ([7dc4b70](https://github.com/sapphiredev/pieces/commit/7dc4b704962da0504e4126c1c8e415677cd84f4c))
-   **ts-node-dev-support:** check if env variable is set ([#102](https://github.com/sapphiredev/pieces/issues/102)) ([4d8bbc8](https://github.com/sapphiredev/pieces/commit/4d8bbc8022e492714b8c8fc1ee98432777cae525))

## [2.2.0](https://github.com/sapphiredev/pieces/compare/v2.1.0...v2.2.0) (2021-08-26)

### Features

-   **store:** add `unloadAll` ([#91](https://github.com/sapphiredev/pieces/issues/91)) ([3909c51](https://github.com/sapphiredev/pieces/commit/3909c51734852b60f7161e931db56b94e41a4099))

### Bug Fixes

-   **LoaderStrategy:** add `.ts` to allow for ts-node usage ([#87](https://github.com/sapphiredev/pieces/issues/87)) ([193abcd](https://github.com/sapphiredev/pieces/commit/193abcda91f8efa4474db120de634e0a0a8224cf)), closes [#86](https://github.com/sapphiredev/pieces/issues/86)

## [2.1.0](https://github.com/sapphiredev/pieces/compare/v2.0.0...v2.1.0) (2021-06-19)

### Features

-   **types:** remove Constructor, Awaited, Ctor and Arr types - use @sapphire/utilities instead ([#84](https://github.com/sapphiredev/pieces/issues/84)) ([538dbb5](https://github.com/sapphiredev/pieces/commit/538dbb5c69a05fbb5fdeb2c07bf08d9f7a9445ac))
-   added StoreRegistry ([#76](https://github.com/sapphiredev/pieces/issues/76)) ([b9f7198](https://github.com/sapphiredev/pieces/commit/b9f71987711f0336c231774f9ea9d95827fa4dfb))

### Bug Fixes

-   **docs:** update-tsdoc-for-vscode-may-2021 ([#83](https://github.com/sapphiredev/pieces/issues/83)) ([74aae8f](https://github.com/sapphiredev/pieces/commit/74aae8fa43923345cfd4d878a3f5fc65cb3a7bb2))
-   these files are EXECUTABLE MOM ([97a7cb7](https://github.com/sapphiredev/pieces/commit/97a7cb7c06fa63fa6c5d42572dbde36a596bc63f))

## [2.0.0](https://github.com/sapphiredev/pieces/compare/v1.2.5...v2.0.0) (2021-05-08)

### ⚠ BREAKING CHANGES

-   Renamed `PieceContextExtras` to `Container`, usage and augmentation is the same.
-   Removed `Store.injectedContext`, use globally exported `container`
    variable instead.
-   Renamed `Store#context` to `Store#container`.
-   Renamed `Piece#context` to `Piece#container`.

-   minor naming changes for consistency with ecosystem ([40f85d6](https://github.com/sapphiredev/pieces/commit/40f85d635fc482d747f461c88380c7a3783a2c1b))

### [1.2.5](https://github.com/sapphiredev/pieces/compare/v1.2.4...v1.2.5) (2021-05-02)

### Bug Fixes

-   drop the `www.` from the SapphireJS URL ([e87e50e](https://github.com/sapphiredev/pieces/commit/e87e50ef5caf7b2b0490a6a429de13364747070d))
-   update all the SapphireJS URLs from `.com` to `.dev` ([0a9c1b3](https://github.com/sapphiredev/pieces/commit/0a9c1b384e5c78bb50e85d8c7cf2c9f7b80aa727))

### [1.2.4](https://github.com/sapphiredev/pieces/compare/v1.2.3...v1.2.4) (2021-04-21)

### Bug Fixes

-   change all Sapphire URLs from "project"->"community" & use our domain where applicable 👨‍🌾🚜 ([#69](https://github.com/sapphiredev/issues/69)) ([fc55625](https://github.com/sapphi/sapphiredev/fc55625fa83ade76193d3e990f97bfedecbcb526))

### [1.2.3](https://github.com/sapphiredev/compare/v1.2.2...v1.2.3) (2021-03-16)

### Bug Fixes

-   add tslib as dependency ([a7d9695](https://github.com/sapphiredev/commit/a7d969542895de4fb876475cb35acc8d2851d9ff))
-   update packages, ship with tslib ([f7b76c2](https://github.com/sapphiredev/commit/f7b76c266c355268260f689f1343ac0e48b3d6ea))

### [1.2.2](https://github.com/sapphiredev/compare/v1.2.1...v1.2.2) (2021-02-12)

### Bug Fixes

-   **docs:** tsdoc has been improved ([c9ee146](https://github.com/sapphiredev/commit/c9ee14633ed56f32343c08802d6c31116b451789))

### [1.2.1](https://github.com/sapphiredev/compare/v1.2.0...v1.2.1) (2021-01-30)

### Bug Fixes

-   update discord redirect URL ([f1dbdee](https://github.com/sapphiredev/commit/f1dbdee9f14e00eb800bee3a2d3d7ff46d4c6036))
-   **aliaspiece:** make aliases writable ([#51](https://github.com/sapphiredev/issues/51)) ([7ed3da6](https://github.com/sapphi/sapphiredev/7ed3da6ca22d59dd25c0691e11032e6e54e7d96d))

## [1.2.0](https://github.com/sapphiredev/compare/v1.1.0...v1.2.0) (2021-01-21)

### Features

-   Expose Store.construct & Store.insert ([#47](https://github.com/sapphiredev/issues/47)) ([797ddac](https://github.com/sapphi/sapphiredev/797ddac348aff134c1af1d308357ba00d0edd6b3))

## [1.1.0](https://github.com/sapphiredev/compare/v1.0.1...v1.1.0) (2021-01-08)

### Features

-   **store:** add trace logging ([#45](https://github.com/sapphiredev/issues/45)) ([79a4f9e](https://github.com/sapphi/sapphiredev/79a4f9e66c610522931e66655f60e6bff7739e6a))
-   add AliasStore#has ([#43](https://github.com/sapphiredev/issues/43)) ([87a6213](https://github.com/sapphi/sapphiredev/87a6213f2bdea8226904534ee8d11479eafe8c94))

### [1.0.1](https://github.com/sapphiredev/compare/v1.0.0...v1.0.1) (2020-12-28)

### Bug Fixes

-   **loader:** compare constructors instead of prototypes ([#40](https://github.com/sapphiredev/issues/40)) ([807cf6a](https://github.com/sapphi/sapphiredev/807cf6aded9c089fcc15c5d8fa2206bdd68e91c2))
-   **store:** call unload when onLoad disables the piece ([#39](https://github.com/sapphiredev/issues/39)) ([4bb9be0](https://github.com/sapphi/sapphiredev/4bb9be0d45caf8604545a5d55eb80b5805972cc5))

## 1.0.0 (2020-12-22)

### Features

-   added ILoaderStrategy#onLoadAll, renamed onPostLoad to onLoad ([#37](https://github.com/sapphiredev/issues/37)) ([8c725d8](https://github.com/sapphi/sapphiredev/8c725d84f2592f27ff6da86d29e603128d5a1691))
-   added smarter root and type detection ([#38](https://github.com/sapphiredev/issues/38)) ([3492c60](https://github.com/sapphi/sapphiredev/3492c601f6e301cd175966a5769b3e68f8276847))
-   export RootScan ([c4e909b](https://github.com/sapphiredev/commit/c4e909b5955e828e3d721bc4cafb89ab16dbeb83))
-   output type declerations to a single .d.ts file ([#30](https://github.com/sapphiredev/issues/30)) ([f76f0b5](https://github.com/sapphi/sapphiredev/f76f0b5ca4e3e1d3480a8383e13c7ee52a6869e4))
-   **piece:** rename disable to unload, add reload ([#36](https://github.com/sapphiredev/issues/36)) ([f0eec9c](https://github.com/sapphi/sapphiredev/f0eec9c0878d4f4c91b85a69f926b975bc2df96e))
-   add Piece#{onLoad,onUnload} ([f0627cc](https://github.com/sapphiredev/commit/f0627ccae333e7f59b9849a72d776025764aec80))
-   add Piece#disable ([bc8aa03](https://github.com/sapphiredev/commit/bc8aa031c2537af945e3b682a01444cdfe36c6f3))
-   export AliasPiece and AliasStore in index ([4522412](https://github.com/sapphiredev/commit/4522412f9081c837c5f0547ad3e0782cb6ea39e6))
-   first version of the loader ([9f27f77](https://github.com/sapphiredev/commit/9f27f77a430e58a1f210a6aa7a30a69070ff0cc7))
-   more descriptive error message ([#14](https://github.com/sapphiredev/issues/14)) ([51d1b52](https://github.com/sapphi/sapphiredev/51d1b5248dab37c3f10b0df3fd71074df800841e))
-   pieces v2! ([#29](https://github.com/sapphiredev/issues/29)) ([792d68a](https://github.com/sapphi/sapphiredev/792d68a0898206c66b1b0796e9c5f484ee0730b0))
-   **piece:** add disable() method ([ca0ef2e](https://github.com/sapphiredev/commit/ca0ef2e4cd7cc77406a692c5f99a5ee8f3d72446))
-   **store:** add Store#name ([13f2eee](https://github.com/sapphiredev/commit/13f2eee159b95b4fe15656a7a0f144d94b4203fc))
-   **store:** make walk not error no ENOENT ([ef7ced5](https://github.com/sapphiredev/commit/ef7ced53855701c043718d861f0071045b56e5a7))
-   add Piece#toJSON ([e902a04](https://github.com/sapphiredev/commit/e902a04bc77f96c2bfa3004da243c82b60b2ee4c))
-   added MissingExportsError ([7234df4](https://github.com/sapphiredev/commit/7234df49844f1c28edadb04ac5f45a29cb1fb3b1))
-   more types, more docs, better API ([51033e0](https://github.com/sapphiredev/commit/51033e02a51dbf0e8ca8f2df0e07312f320837b0))

### Bug Fixes

-   make Store#{load,insert} atomic ([9700c4e](https://github.com/sapphiredev/commit/9700c4edb6b862533388f1b2f17e2ff96f81e024))
-   make Store#load easier to use ([69d52c5](https://github.com/sapphiredev/commit/69d52c59efdd3a4f2172b5b385b31c4e017df700))
-   removed testing and coverage ([4cba117](https://github.com/sapphiredev/commit/4cba11777b992c7c63eaa39fc6278cf97104b9d9))
-   specify return type for Piece#toJSON ([4fe4892](https://github.com/sapphiredev/commit/4fe4892603a57ca5ee78a7c1be650d19ff4be7e5))
-   sub directory loading ([#1](https://github.com/sapphiredev/issues/1)) ([b0b227c](https://github.com/sapphi/sapphiredev/b0b227c76220d39b6aa1110244d83889fdafb961))
-   use name instead of path in Store#construct ([c2dd9ce](https://github.com/sapphiredev/commit/c2dd9cede1afbfb57fdb59c0ad2b88433ec7e92e))
-   use pathToFileURL instead of new URL ([96c3e9c](https://github.com/sapphiredev/commit/96c3e9c57717c93edd9376e63e89ae222e65ff2a))
-   use the actual path ([94e0844](https://github.com/sapphiredev/commit/94e084475dcbcb6c9e57623b2756fdbdb42abe66))
-   **alias-store:** resolved build error ([e121f3b](https://github.com/sapphiredev/commit/e121f3bbcc7f76ac7bbc9db8522670042a6307fe))
-   **piece:** receive name via PieceContext for better defaults ([b062c58](https://github.com/sapphiredev/commit/b062c589f417142e325e39c7174d7d30bec70afd))
-   **store:** resolved build error for node.js 12 ([849a184](https://github.com/sapphiredev/commit/849a184e53abe44a227589f6b290e429caaec277))
