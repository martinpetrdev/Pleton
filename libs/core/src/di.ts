import {
  Class,
  ClassInstance,
  DependencyType,
  PletonDIContainer,
} from "./internal";

export function inject<C extends Class<unknown, []>>(type: C) {
  return PletonDIContainer.instance.get(DependencyType.Injectable, type);
}
