import "reflect-metadata";
import {PletonApplication, Application, PletonHTTPError, PletonHTTPResponse, HTTPStatusCode} from "@pleton/core"
import {PletonHonoAdapter} from "@pleton/adapter-hono";
import {GreetingService} from "./greeting.service";
import {GreetingController} from "./greeting.controller";

@Application
export class Playground extends PletonApplication {
  async run(): Promise<void> {
    this.http.useAdapter(new PletonHonoAdapter())
    
    await this.http.listen(3030);
  }
}
