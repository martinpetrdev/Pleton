import {OkResponse, RestController, RestGet} from "@pleton/core";

@RestController("/greeting")
export class GreetingController {
  @RestGet("/")
  async get() {
    return new OkResponse("Hello from v1");
  }
}