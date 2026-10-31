export abstract class PletonApplication {
  public async init() {
    await this.run();
  }

  abstract run(): Promise<void>;
}
