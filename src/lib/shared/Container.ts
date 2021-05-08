/**
 * Represents the type of the properties injected into the container, which is available at {@link container}.
 *
 * Because Sapphire works as a standalone framework (independent of external libraries), there is a need to pass data
 * from one place to another, which would vary depending on the user and their use-cases.
 *
 * Furthermore, plugins may use this structure to add properties referencing to the plugin's objects so they can be
 * accessed by both the user and the plugin at any moment and at any place.
 *
 * Finally, both library developers and bot developers should augment the Container interface from this module using
 * [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).
 */
export interface Container {}

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
