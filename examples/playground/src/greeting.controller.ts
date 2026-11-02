import {OkResponse, RestController, RestGet, UseRestGuard} from "@pleton/core";
import {HeaderGuard} from "./header.guard";

@RestController("/greeting")
@UseRestGuard(HeaderGuard)
export class GreetingController {
  @RestGet("/")
  async get() {
    return new OkResponse("Hello!")
  }
}