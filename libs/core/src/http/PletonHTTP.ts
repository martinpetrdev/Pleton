import {
  HTTPMethod,
  PletonHTTPAdapter,
  RouteContext,
} from "./PletonHTTPAdapter";
import { Class, ClassInstance, DependencyType, Reflection } from "../internal";
import { PletonLogger } from "../logger/PletonLogger";
import { fixURLPath, joinURLPaths } from "./URL";
import {
  HTTPStatusCode,
  PletonHTTPError,
  PletonHTTPResponse,
} from "./PletonHTTPResponse";
import { PletonApplication } from "../application";
import { IGuard } from "../types";

export class PletonHTTP {
  private _adapter: PletonHTTPAdapter | null = null;

  private readonly logger = new PletonLogger("PletonHTTP");

  constructor(private readonly application: PletonApplication) {}

  public useAdapter(adapter: PletonHTTPAdapter) {
    this._adapter = adapter;

    this.registerControllers(
      this.application["di"].getAll(DependencyType.RestController),
    );
  }

  private get adapter() {
    if (!this._adapter)
      throw new Error("No adapter set, please call this.http.useAdapter(...);");

    return this._adapter;
  }

  public async listen(port: number): Promise<void> {
    await this.adapter.listen(port);
  }

  private registerControllers<C extends Class<object, []>>(
    controllers: ClassInstance<C>[],
  ) {
    for (const controller of controllers) {
      let prefix = fixURLPath(
        Reflection.getClassDecoration(
          controller.constructor,
          "restControllerPrefix",
        ),
      );
      const version = Reflection.getClassDecoration(
        controller.constructor,
        "version",
      );
      if (this.application["_defaultVersioningVersion"] !== null)
        prefix = joinURLPaths(
          fixURLPath(version ?? this.application["_defaultVersioningVersion"]),
          prefix,
        );

      const guards = (Reflection.getClassDecoration(
        controller.constructor,
        "restGuards",
      ) ?? new Set()) as Set<Class<IGuard, []>>;

      this.logger.info(
        `Registering REST controller ${controller.constructor.name} (${prefix})...`,
      );

      for (const prop of Object.getOwnPropertyNames(
        Object.getPrototypeOf(controller),
      )) {
        if (prop === "constructor") continue; // Skipped - never a route

        const method = controller[prop as keyof typeof controller]! as (
          ...args: any[]
        ) => Promise<PletonHTTPResponse<any>>;
        const isRoute = Reflection.getMethodDecoration(method, "isRestRoute");
        if (!isRoute) continue;

        const path = fixURLPath(
          Reflection.getMethodDecoration(method, "restRoutePath"),
        );
        const fullPath = joinURLPaths(prefix, path);
        const httpMethod = Reflection.getMethodDecoration(
          method,
          "restRouteMethod",
        );

        this._adapter!.$addRouteHandler(
          httpMethod as HTTPMethod,
          fullPath,
          async (ctx) => {
            const argCount =
              Reflection.getMethodDecoration(method, "paramCount") ?? 0;
            const args = await Promise.all(
              new Array(argCount).fill(null).map(async (_, i) => {
                const argMethod = Reflection.getParameterDecoration(
                  method,
                  i,
                  "resolve",
                ) as (ctx: RouteContext) => any;

                return await argMethod?.(ctx);
              }),
            );

            return await (async () => {
              await this.runGuards(ctx, [...guards]);

              return await method.bind(controller)(...args);
            })();
          },
        );

        this.logger.info(
          `Registered REST route ${controller.constructor.name}.${prop} (${fullPath})...`,
        );
      }
    }
  }

  private async runGuards(ctx: RouteContext, guards: Class<IGuard, []>[]) {
    for (const guard of guards) {
      const ginstance = this.application["di"].get(
        DependencyType.RestGuard,
        guard,
      );
      if (!ginstance)
        throw new Error(`Guard with the name ${guard.name} does not exist`);

      const argCount =
        Reflection.getMethodDecoration(ginstance.handleRequest, "paramCount") ??
        0;
      const args = await Promise.all(
        new Array(argCount).fill(null).map(async (_, i) => {
          const argMethod = Reflection.getParameterDecoration(
            ginstance.handleRequest,
            i,
            "resolve",
          ) as (ctx: RouteContext) => any;

          return await argMethod?.(ctx);
        }),
      );

      const res = await ginstance.handleRequest(...args);
      if (!res)
        throw new PletonHTTPError("Access denied", HTTPStatusCode.Forbidden);
    }
  }
}
