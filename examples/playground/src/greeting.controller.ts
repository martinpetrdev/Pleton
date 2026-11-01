import {HTTPStatusCode, inject, OkResponse, PletonHTTPResponse, RestController, RestGet} from "@pleton/core";
import {GreetingService} from "./greeting.service";

@RestController("/greeting")
export class GreetingController {
  private svc = inject(GreetingService);

  @RestGet("/")
  async get() {
    return new OkResponse(this.svc.getGreeting())
  }
}