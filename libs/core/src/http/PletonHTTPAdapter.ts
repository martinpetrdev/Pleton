import { PletonHTTPResponse } from "./PletonHTTPResponse";

export enum HTTPMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export interface RouteContext {
  query: {
    [key: string]: string;
  };
}
export type RouteHandler<T> = (
  ctx: RouteContext,
) => Promise<PletonHTTPResponse<T>>;

export abstract class PletonHTTPAdapter {
  abstract listen(port: number): Promise<void>;
  abstract $addRouteHandler<T>(
    method: HTTPMethod,
    path: string,
    handler: RouteHandler<T>,
  ): void;
}
