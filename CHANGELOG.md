# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2020-12-22)

### Features

-   added ILoaderStrategy#onLoadAll, renamed onPostLoad to onLoad ([#37](https://github.com/sapphire-project/pieces/issues/37)) ([8c725d8](https://github.com/sapphire-project/pieces/commit/8c725d84f2592f27ff6da86d29e603128d5a1691))
-   added smarter root and type detection ([#38](https://github.com/sapphire-project/pieces/issues/38)) ([3492c60](https://github.com/sapphire-project/pieces/commit/3492c601f6e301cd175966a5769b3e68f8276847))
-   export RootScan ([c4e909b](https://github.com/sapphire-project/pieces/commit/c4e909b5955e828e3d721bc4cafb89ab16dbeb83))
-   output type declerations to a single .d.ts file ([#30](https://github.com/sapphire-project/pieces/issues/30)) ([f76f0b5](https://github.com/sapphire-project/pieces/commit/f76f0b5ca4e3e1d3480a8383e13c7ee52a6869e4))
-   **piece:** rename disable to unload, add reload ([#36](https://github.com/sapphire-project/pieces/issues/36)) ([f0eec9c](https://github.com/sapphire-project/pieces/commit/f0eec9c0878d4f4c91b85a69f926b975bc2df96e))
-   add Piece#{onLoad,onUnload} ([f0627cc](https://github.com/sapphire-project/pieces/commit/f0627ccae333e7f59b9849a72d776025764aec80))
-   add Piece#disable ([bc8aa03](https://github.com/sapphire-project/pieces/commit/bc8aa031c2537af945e3b682a01444cdfe36c6f3))
-   export AliasPiece and AliasStore in index ([4522412](https://github.com/sapphire-project/pieces/commit/4522412f9081c837c5f0547ad3e0782cb6ea39e6))
-   first version of the loader ([9f27f77](https://github.com/sapphire-project/pieces/commit/9f27f77a430e58a1f210a6aa7a30a69070ff0cc7))
-   more descriptive error message ([#14](https://github.com/sapphire-project/pieces/issues/14)) ([51d1b52](https://github.com/sapphire-project/pieces/commit/51d1b5248dab37c3f10b0df3fd71074df800841e))
-   pieces v2! ([#29](https://github.com/sapphire-project/pieces/issues/29)) ([792d68a](https://github.com/sapphire-project/pieces/commit/792d68a0898206c66b1b0796e9c5f484ee0730b0))
-   **piece:** add disable() method ([ca0ef2e](https://github.com/sapphire-project/pieces/commit/ca0ef2e4cd7cc77406a692c5f99a5ee8f3d72446))
-   **store:** add Store#name ([13f2eee](https://github.com/sapphire-project/pieces/commit/13f2eee159b95b4fe15656a7a0f144d94b4203fc))
-   **store:** make walk not error no ENOENT ([ef7ced5](https://github.com/sapphire-project/pieces/commit/ef7ced53855701c043718d861f0071045b56e5a7))
-   add Piece#toJSON ([e902a04](https://github.com/sapphire-project/pieces/commit/e902a04bc77f96c2bfa3004da243c82b60b2ee4c))
-   added MissingExportsError ([7234df4](https://github.com/sapphire-project/pieces/commit/7234df49844f1c28edadb04ac5f45a29cb1fb3b1))
-   more types, more docs, better API ([51033e0](https://github.com/sapphire-project/pieces/commit/51033e02a51dbf0e8ca8f2df0e07312f320837b0))

### Bug Fixes

-   make Store#{load,insert} atomic ([9700c4e](https://github.com/sapphire-project/pieces/commit/9700c4edb6b862533388f1b2f17e2ff96f81e024))
-   make Store#load easier to use ([69d52c5](https://github.com/sapphire-project/pieces/commit/69d52c59efdd3a4f2172b5b385b31c4e017df700))
-   removed testing and coverage ([4cba117](https://github.com/sapphire-project/pieces/commit/4cba11777b992c7c63eaa39fc6278cf97104b9d9))
-   specify return type for Piece#toJSON ([4fe4892](https://github.com/sapphire-project/pieces/commit/4fe4892603a57ca5ee78a7c1be650d19ff4be7e5))
-   sub directory loading ([#1](https://github.com/sapphire-project/pieces/issues/1)) ([b0b227c](https://github.com/sapphire-project/pieces/commit/b0b227c76220d39b6aa1110244d83889fdafb961))
-   use name instead of path in Store#construct ([c2dd9ce](https://github.com/sapphire-project/pieces/commit/c2dd9cede1afbfb57fdb59c0ad2b88433ec7e92e))
-   use pathToFileURL instead of new URL ([96c3e9c](https://github.com/sapphire-project/pieces/commit/96c3e9c57717c93edd9376e63e89ae222e65ff2a))
-   use the actual path ([94e0844](https://github.com/sapphire-project/pieces/commit/94e084475dcbcb6c9e57623b2756fdbdb42abe66))
-   **alias-store:** resolved build error ([e121f3b](https://github.com/sapphire-project/pieces/commit/e121f3bbcc7f76ac7bbc9db8522670042a6307fe))
-   **piece:** receive name via PieceContext for better defaults ([b062c58](https://github.com/sapphire-project/pieces/commit/b062c589f417142e325e39c7174d7d30bec70afd))
-   **store:** resolved build error for node.js 12 ([849a184](https://github.com/sapphire-project/pieces/commit/849a184e53abe44a227589f6b290e429caaec277))
