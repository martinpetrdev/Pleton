import "reflect-metadata";
import {PletonApplication, Application, PletonHTTPError, PletonHTTPResponse, HTTPStatusCode} from "@pleton/core"
import {PletonHonoAdapter} from "@pleton/adapter-hono";

@Application
export class Playground extends PletonApplication {
  async run(): Promise<void> {
    this.enableVersioning("v1")
    
    this.http.useAdapter(new PletonHonoAdapter())
    await this.http.listen(3030);
  }
}
