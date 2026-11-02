import { Reflection } from "../internal";

export const RestGuard = Reflection.decorateClass((set) => {
  set("isRestGuard", true);
});
