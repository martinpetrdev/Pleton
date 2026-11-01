import { Reflection } from "../internal";
import { RouteContext } from "../http";

export const RestJsonBody = (key?: string) =>
  Reflection.decorateParameter((set) => {
    set("resolve", async (ctx: RouteContext) => {
      const body = await ctx.body.getJSON();

      return key ? body[key] : body;
    });
  });
