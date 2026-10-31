import { Reflection } from "../internal";

export const Application = Reflection.decorateClass((set) => {
  set("isApplication", true);
});
