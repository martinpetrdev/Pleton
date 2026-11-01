import { PletonHTTPAdapter } from "@pleton/core";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

export class PletonHonoAdapter extends PletonHTTPAdapter {
  _honoInstance: Hono = new Hono();

  constructor() {
    super();
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
}
