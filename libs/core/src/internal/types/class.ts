export type Class<T extends unknown, A extends unknown[]> = new (
  ...args: A
) => T;
export type ClassInstance<C extends Class<unknown, any[]>> = InstanceType<C>;
