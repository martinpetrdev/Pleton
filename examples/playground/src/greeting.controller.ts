import {
  HTTPStatusCode,
  inject,
  OkResponse,
  PletonHTTPResponse, RestJsonBody,
  RestController, RestDelete,
  RestGet, RestPatch,
  RestPost, RestPut,
  RestQuery, RestFormDataBody, RestTextBody
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
  async post(@RestTextBody() body: string) {
    return new OkResponse({
      myBody: body
    })
  }
}