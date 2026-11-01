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

  static decorateMethod<T>(
    decorator: (set: SetReflectionMetadataFunction) => void,
  ) {
    return (cls: any, paramName: string, descriptor: PropertyDescriptor) => {
      decorator((key, value) => {
        this.setMetadata(descriptor.value, key, value);
      });
    };
  }

  static decorateParameter<T>(
    decorator: (set: SetReflectionMetadataFunction) => void,
  ) {
    return (cls: any, methodName: string, paramId: number) => {
      // Function.length ignores params with defaults, so track the count here
      const method = cls[methodName];

      const count = this.getMetadata(method, "paramCount") ?? 0;
      this.setMetadata(method, "paramCount", Math.max(count, paramId + 1));

      decorator((key, value) => {
        this.setMetadata(cls[methodName], `${paramId}#${key}`, value);
      });
    };
  }

  static getClassDecoration(target: any, key: string) {
    return this.getMetadata(target, key);
  }

  static getMethodDecoration(target: any, key: string) {
    return this.getMetadata(target, key);
  }

  static getParameterDecoration(target: any, pos: number, key: string) {
    return this.getMetadata(target, `${pos}#${key}`);
  }

  private static setMetadata(target: any, key: string, value: any) {
    target[Symbol.for(`pleton.internals.${key}`)] = value;
  }

  private static getMetadata(target: any, key: string) {
    return target[Symbol.for(`pleton.internals.${key}`)];
  }
}
