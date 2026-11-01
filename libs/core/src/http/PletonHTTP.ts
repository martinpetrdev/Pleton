import {
  HTTPMethod,
  PletonHTTPAdapter,
  RouteHandler,
} from "./PletonHTTPAdapter";
import {
  Class,
  ClassInstance,
  DependencyType,
  PletonDIContainer,
  Reflection,
} from "../internal";
import { PletonLogger } from "../logger/PletonLogger";
import { fixURLPath, joinURLPaths } from "./URL";

export class PletonHTTP {
  private _adapter: PletonHTTPAdapter | null = null;

  private readonly logger = new PletonLogger("PletonHTTP");

  constructor() {}

  public useAdapter(adapter: PletonHTTPAdapter) {
    this._adapter = adapter;

    this.registerControllers(
      PletonDIContainer.instance.getAll(DependencyType.RestController),
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
      const prefix = fixURLPath(
        Reflection.getClassDecoration(
          controller.constructor,
          "restControllerPrefix",
        ),
      );

      this.logger.info(
        `Registering REST controller ${controller.constructor.name} (${prefix})...`,
      );

      for (const prop of Object.getOwnPropertyNames(
        Object.getPrototypeOf(controller),
      )) {
        if (prop === "constructor") continue; // Skipped - never a route

        const method = controller[prop as keyof typeof controller]!;
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
          (method as RouteHandler<any>).bind(controller),
        );

        this.logger.info(
          `Registered REST route ${controller.constructor.name}.${prop} (${fullPath})...`,
        );
      }
    }
  }
}
