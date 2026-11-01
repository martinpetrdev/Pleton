import { Reflection } from "../internal";
import { RouteContext } from "../http";

export const RestBlobBody = () =>
  Reflection.decorateParameter((set) => {
    set("resolve", async (ctx: RouteContext) => await ctx.body.getBlob());
  });
