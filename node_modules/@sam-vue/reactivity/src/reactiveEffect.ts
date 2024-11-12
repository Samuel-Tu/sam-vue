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
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }

    let propertyMap = depsMap.get(property);
    if (!propertyMap) {
      depsMap.set(
        property,
        (propertyMap = createDep(() => propertyMap.delete(property), property))
      );
    }

    trackEffect(currentReactiveEffect, propertyMap);
  }
}

export function trigger(target, property, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const propertyMap = depsMap.get(property);
  if (propertyMap) {
    console.log(1);
    triggerEffects(propertyMap);
  }
}
