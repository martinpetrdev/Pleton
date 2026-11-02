import { PletonLogger } from "../../logger/PletonLogger";
import { Class, ClassInstance } from "../types";

export enum DependencyType {
  Injectable,
  RestController,
  RestGuard,
}

export class PletonDIContainer {
  // class -> instance (undefined until first requested)
  private readonly dependencies: {
    [key in DependencyType]: Map<Class<unknown, []>, unknown>;
  } = {
    [DependencyType.Injectable]: new Map(),
    [DependencyType.RestController]: new Map(),
    [DependencyType.RestGuard]: new Map(),
  };
  private readonly resolving = new Set<Class<unknown, []>>();

  private static _instance: PletonDIContainer;
  public static get instance() {
    if (!this._instance)
      throw new Error("Dependency injection container is not yet initialized");

    return this._instance;
  }

  private logger: PletonLogger = new PletonLogger("PletonDIContainer");

  constructor() {
    PletonDIContainer._instance = this;
  }

  public init() {
    this.logger.info("Initialized dependency injection container.");
  }

  public register(type: DependencyType, cls: Class<unknown, []>) {
    this.dependencies[type].set(cls, undefined);

    this.logger.info("Registered dependency", cls.name + ".");
  }

  // Instantiates lazily, so inject() works regardless of registration order.
  public get<C extends Class<unknown, []>>(
    depType: DependencyType,
    identifier: C,
  ): ClassInstance<C> | null {
    const deps = this.dependencies[depType];
    if (!deps.has(identifier)) return null;

    let instance = deps.get(identifier);
    if (instance === undefined) {
      if (this.resolving.has(identifier))
        throw new Error(`Circular dependency detected at ${identifier.name}.`);

      this.resolving.add(identifier);

      try {
        instance = new identifier();
      } finally {
        this.resolving.delete(identifier);
      }

      deps.set(identifier, instance);
    }

    return instance as ClassInstance<C>;
  }

  public getAll<C extends Class<object, []>>(depType: DependencyType) {
    const deps = this.dependencies[depType];
    const instances: ClassInstance<C>[] = [];

    for (const [depClass] of deps) {
      // TODO: Speed up by creating instance right here or reusing if present in deps ([class, instance])
      instances.push(this.get(depType, depClass as C)!);
    }

    return instances;
  }
}
