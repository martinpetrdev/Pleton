import {HTTPStatusCode, inject, OkResponse, PletonHTTPResponse, RestController, RestGet, RestQuery} from "@pleton/core";
import {GreetingService} from "./greeting.service";

@RestController("/greeting")
export class GreetingController {
  private svc = inject(GreetingService);

  @RestGet("/")
  async get(@RestQuery("name") name: string, @RestQuery("age") age: number) {
    return new OkResponse(this.svc.getGreeting(name, age))
  }
}