import { PletonHTTP } from "../http";
import { Class, DependencyType, PletonDIContainer } from "../internal";
import { PletonDiscovery } from "./PletonDiscovery";
import { PletonLogger } from "../logger/PletonLogger";

export abstract class PletonApplication {
  public readonly http = new PletonHTTP(this);
  private readonly di = new PletonDIContainer();
  private readonly discovery: PletonDiscovery;

  private _defaultVersioningVersion: string | null = null;

  private readonly logger: PletonLogger;

  constructor() {
    if (!PletonDiscovery.instance)
      throw new Error("PletonDiscovery is not instantiated");

    this.discovery = PletonDiscovery.instance;
    this.logger = new PletonLogger(this.constructor.name); // takes name of the child class
  }

  public async init() {
    this.logger.info("Initializing Pleton application...");

    this.di.init();
    this.registerDependencies();

    this.logger.info("Application initialized.");

    await this.run();
  }

  private registerDependencies() {
    for (const dep of this.discovery.injectableClass()) {
      this.di.register(DependencyType.Injectable, dep);
    }

    for (const dep of this.discovery.restControllerClass()) {
      this.di.register(DependencyType.RestController, dep);
    }

    for (const dep of this.discovery.restGuardClass()) {
      this.di.register(DependencyType.RestGuard, dep);
    }
  }

  public enableVersioning(defaultVersion: string) {
    if (this._defaultVersioningVersion)
      throw new Error("Versioning is already enabled!");

    this._defaultVersioningVersion = defaultVersion;
  }

  public getInjectable<T extends Class<unknown, []>>(type: T) {
    return this.di.get(DependencyType.Injectable, type);
  }

  abstract run(): Promise<void>;
}
