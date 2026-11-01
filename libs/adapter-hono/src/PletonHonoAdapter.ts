import {
  HTTPMethod,
  HTTPStatusCode,
  PletonHTTPAdapter,
  PletonHTTPError,
  PletonHTTPResponse,
  RouteContext,
  RouteHandler,
} from "@pleton/core";
import { Context, Hono, HonoRequest } from "hono";
import { serve } from "@hono/node-server";

export class PletonHonoAdapter extends PletonHTTPAdapter {
  _honoInstance: Hono = new Hono();

  constructor() {
    super();

    this._honoInstance.notFound(async (c) => {
      return await this.handleRequest(this.notFoundErrorHandler.bind(this), c);
    });
  }

  async listen(port: number): Promise<void> {
    await new Promise((res) =>
      serve(
        {
          fetch: this._honoInstance.fetch,
          port: port,
        },
        res,
      ),
    );
  }

  private async notFoundErrorHandler(
    ctx: RouteContext,
  ): Promise<PletonHTTPResponse<any>> {
    throw new PletonHTTPError(
      "The requested resource was not found",
      HTTPStatusCode.NotFound,
    );
  }

  private internalServerErrorHandler(
    ctx: RouteContext,
  ): Promise<PletonHTTPResponse<any>> {
    throw new PletonHTTPError(
      "Internal server error",
      HTTPStatusCode.InternalServerError,
    );
  }

  $addRouteHandler<T>(
    method: HTTPMethod,
    path: string,
    handler: RouteHandler<T>,
  ): void {
    this._honoInstance[method](path, async (c) => {
      return await this.handleRequest(handler, c);
    });
  }

  private async handleRequest<T>(
    handler: RouteHandler<T>,
    c: Context,
  ): Promise<Response> {
    let response: PletonHTTPResponse<any>;
    try {
      response = await handler(this.getContext(c)).catch((err) => {
        if (err instanceof PletonHTTPError) return err.response;

        // TODO: Return 500?
        throw err;
      });
    } catch (err) {
      if (err instanceof PletonHTTPError) response = err.response;

      // TODO: Return 500?
      else throw err;
    }

    if (!(response instanceof PletonHTTPResponse))
      return this.handleRequest(this.internalServerErrorHandler.bind(this), c);

    if (response.isJSON)
      return c.json(response.data, response.statusCode as any);
    else if (response.isText)
      return c.text(response.data as string, response.statusCode as any);
    else if (response.isHTML)
      return c.html(response.data, response.statusCode as any);
    else return c.body(response.data as any, response.statusCode as any);
  }

  private getContext(honoCtx: Context) {
    return {};
  }
}
