import { Reflection } from "../internal";

export const RestController = (pathPrefix: string) =>
  Reflection.decorateClass((set) => {
    set("isRestController", true);
    set("restControllerPrefix", pathPrefix);
  });
