# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
