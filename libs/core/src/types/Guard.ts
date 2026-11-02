export interface IGuard {
  handleRequest(...args: any[]): Promise<boolean>;
}
