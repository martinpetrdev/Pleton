export enum DependencyType {
  Injectable,
}

export class PletonDIContainer {
  private readonly dependencies: {
    [key in DependencyType]: Set<any>;
  } = {
    [DependencyType.Injectable]: new Set(),
  };

  constructor() {}

  public init() {}

  public register(type: DependencyType, cls: new () => any) {
    this.dependencies[type]!.add(new cls());
  }
}
