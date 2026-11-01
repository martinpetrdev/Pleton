import { PletonHTTP } from "../http";
import { DependencyType, PletonDIContainer } from "../internal";
import { PletonDiscovery } from "./PletonDiscovery";

export abstract class PletonApplication {
  public readonly http = new PletonHTTP();
  private readonly di = new PletonDIContainer();
  private readonly discovery: PletonDiscovery;

  constructor() {
    if (!PletonDiscovery.instance)
      throw new Error("PletonDiscovery is not instantiated");

    this.discovery = PletonDiscovery.instance;
  }

  public async init() {
    this.di.init();
    this.registerDependencies();

    await this.run();
  }

  private registerDependencies() {
    for (const dep of this.discovery.injectableClass()) {
      this.di.register(DependencyType.Injectable, dep);
    }
  }

  abstract run(): Promise<void>;
}
