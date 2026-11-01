import { PletonDIContainer, Reflection } from "../internal";

export class PletonDiscovery {
  private readonly _entities = new Map<string, any>();
  private static _instance: PletonDiscovery | null = null;

  public static get instance() {
    return PletonDiscovery._instance;
  }

  constructor(mods: {
    [key: string]: {
      [key: string]: any;
    };
  }) {
    this._entities = new Map<string, string>();

    for (const [key, mod] of Object.entries(mods)) {
      for (const [name, entity] of Object.entries(mod)) {
        this._entities.set(`${key}#${name}`, entity);
      }
    }

    PletonDiscovery._instance = this;
  }

  private find(filter: (entity: any) => boolean) {
    const output: string[] = [];

    for (const entity of this._entities) {
      if (filter(entity[1])) output.push(entity[0]);
    }

    return output;
  }

  public appClass() {
    const classes = this.find(
      (e) => Reflection.getClassDecoration(e, "isApplication") === true,
    );

    if (classes.length === 0)
      throw new Error("Could not find a class decorated by @Application.");
    if (classes.length > 1)
      throw new Error(
        "Found multiple classes decorated by @Application, only one is allowed. This could also be caused by extending the decorated class.",
      );

    return this._entities.get(classes[0]);
  }

  public injectableClass() {
    const classes = this.find(
      (e) => Reflection.getClassDecoration(e, "isInjectable") === true,
    );

    return classes.map((c) => this._entities.get(c)!);
  }

  public restControllerClass() {
    const classes = this.find(
      (e) => Reflection.getClassDecoration(e, "isRestController") === true,
    );

    return classes.map((c) => this._entities.get(c)!);
  }
}
