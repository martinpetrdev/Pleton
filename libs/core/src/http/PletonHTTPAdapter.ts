import { PletonHTTPResponse } from "./PletonHTTPResponse";

export enum HTTPMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export type RouteContext = {};
export type RouteHandler<T> = (
  ctx: RouteContext,
) => Promise<PletonHTTPResponse<T>>;

export abstract class PletonHTTPAdapter {
  abstract listen(port: number): Promise<void>;
  protected abstract addRouteHandler<T>(
    method: HTTPMethod,
    path: string,
    handler: RouteHandler<T>,
  ): void;
}
