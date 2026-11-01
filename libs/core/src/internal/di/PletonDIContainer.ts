import { PletonLogger } from "../../logger/PletonLogger";
import { PletonApplication } from "../../application";

export enum DependencyType {
  Injectable,
}

export class PletonDIContainer {
  private readonly dependencies: {
    [key in DependencyType]: Set<any>;
  } = {
    [DependencyType.Injectable]: new Set(),
  };

  private logger: PletonLogger = new PletonLogger("PletonDIContainer");

  constructor() {}

  public init() {
    this.logger.info("Initialized dependency injection container.");
  }

  public register(type: DependencyType, cls: new () => any) {
    this.dependencies[type]!.add(new cls());

    this.logger.info("Registered dependency", cls.name + ".");
  }
}
