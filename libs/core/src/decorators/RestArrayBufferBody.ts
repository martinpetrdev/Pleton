import { Reflection } from "../internal";
import { RouteContext } from "../http";

export const RestArrayBufferBody = () =>
  Reflection.decorateParameter((set) => {
    set(
      "resolve",
      async (ctx: RouteContext) => await ctx.body.getArrayBuffer(),
    );
  });
