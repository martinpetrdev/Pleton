import {HTTPStatusCode, IGuard, PletonHTTPError, RestGuard, RestQuery} from "@pleton/core";

@RestGuard
export class HeaderGuard implements IGuard {
  async handleRequest(@RestQuery("name") name: string): Promise<boolean> {
    if (name !== "heslo") throw new PletonHTTPError("yolo", HTTPStatusCode.InternalServerError)
    return true;
  }
}