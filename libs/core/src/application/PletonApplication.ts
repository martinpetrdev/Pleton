import { PletonHTTP } from "../http/PletonHTTP";

export abstract class PletonApplication {
  public readonly http = new PletonHTTP();

  public async init() {
    await this.run();
  }

  abstract run(): Promise<void>;
}
