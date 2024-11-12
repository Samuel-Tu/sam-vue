import { currentReactiveEffect, trackEffect, triggerEffects } from "./effect";
export const targetMap = new WeakMap();

interface Dep extends Map<any, any> {
  cleanup: () => void;
  name: string;
}

export const createDep = (cleanup: () => void, name: string) => {
  const dep = new Map() as Dep;
  dep.cleanup = cleanup;
  dep.name = name;
  return dep;
};

export function track(target, property) {
  if (currentReactiveEffect) {
    let propertyMap = targetMap.get(target);
    if (!propertyMap) {
      targetMap.set(target, (propertyMap = new Map()));
    }

    let depsMap = propertyMap.get(property);
    if (!depsMap) {
      propertyMap.set(
        property,
        (depsMap = createDep(() => depsMap.delete(property), property))
      );
    }

    trackEffect(currentReactiveEffect, depsMap);
  }
}

export function trigger(target, property, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const propertyMap = depsMap.get(property);
  if (propertyMap) {
    triggerEffects(propertyMap);
  }
}
