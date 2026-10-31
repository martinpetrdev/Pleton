type SetReflectionMetadataFunction = (key: string, value: any) => void;

export class Reflection {
  static decorateClass<T>(
    decorator: (set: SetReflectionMetadataFunction) => void,
  ) {
    return (target: any) => {
      decorator((key, value) => {
        this.setMetadata(target, key, value);
      });
    };
  }

  static getClassDecoration(target: any, key: string) {
    return this.getMetadata(target, key);
  }

  private static setMetadata(target: any, key: string, value: any) {
    target[Symbol.for(`pleton.internals.${key}`)] = value;
  }

  private static getMetadata(target: any, key: string) {
    return target[Symbol.for(`pleton.internals.${key}`)];
  }
}
