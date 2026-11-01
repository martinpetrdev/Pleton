import {OkResponse, RestController, RestGet, Version} from "@pleton/core";

@RestController("/greeting")
@Version("v2")
export class GreetingController {
  @RestGet("/")
  async get() {
    return new OkResponse("Hello from v2 -- the better one");
  }
}