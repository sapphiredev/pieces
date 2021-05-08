/**
 * Represents the data from [[Container]] and may be used for dependency injection.
 * Libraries can provide strict typing by augmenting this module, check
 * [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
 * for more information.
 *
 * The data from this interface is available at {@link container}.
 */
export interface Container extends Record<PropertyKey, unknown> {}

/**
 * The injected variables that will be accessible to any place. To add an extra property, simply add a property with a
 * regular assignment, and it will be available in all places simultaneously.
 *
 * @example
 * ```typescript
 * // Add a reference to the Client:
 * import { container } from '(at)sapphire/pieces';
 *
 * export class SapphireClient extends Client {
 *   constructor(options) {
 *     super(options);
 *
 *     container.client = this;
 *   }
 * }
 *
 * // Can be placed anywhere in a TypeScript file, for JavaScript projects,
 * // you can create an `augments.d.ts` and place the code there.
 * declare module '(at)sapphire/pieces' {
 *   interface Container {
 *     client: SapphireClient;
 *   }
 * }
 *
 * // In any piece, core, plugin, or custom:
 * export class UserCommand extends Command {
 *   public run(message, args) {
 *     // The injected client is available here:
 *     const { client } = this.container;
 *
 *     // ...
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In a plugin's context, e.g. API:
 * class Api extends Plugin {
 *   static [postInitialization]() {
 *     const server = new Server(this);
 *     container.server = server;
 *
 *     // ...
 *   }
 * }
 *
 * declare module '(at)sapphire/pieces' {
 *   interface Container {
 *     server: Server;
 *   }
 * }
 *
 * // In any piece, even those that aren't routes nor middlewares:
 * export class UserRoute extends Route {
 *   public [methods.POST](message, args) {
 *     // The injected server is available here:
 *     const { server } = this.container;
 *
 *     // ...
 *   }
 * }
 * ```
 */
export const container: Container = {};
