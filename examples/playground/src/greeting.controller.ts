import {
  HTTPStatusCode,
  inject,
  OkResponse,
  PletonHTTPResponse,
  RestController, RestDelete,
  RestGet, RestPatch,
  RestPost, RestPut,
  RestQuery
} from "@pleton/core";
import {GreetingService} from "./greeting.service";

@RestController("/greeting")
export class GreetingController {
  private svc = inject(GreetingService);

  @RestGet("/")
  async get(@RestQuery("name") name: string, @RestQuery("age") age: number) {
    return new OkResponse(this.svc.getGreeting(name, age))
  }

  @RestPost("/")
  async post() {
    return new OkResponse({
      status: "went fine"
    })
  }
}