import warn from "./warn";
import { isObject } from "@vue/shared/src";
import { proxyHandler } from "./baseHandler";

export interface Target {
  [ReactiveFlags.IS_REACTIVE]?: Boolean;
}

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

const reactiveMap = new WeakMap();

export function reactive(target: object) {
  return createReactiveObject(target);
}

function createReactiveObject(target: Target) {
  if (!isObject(target)) {
    warn(`the target is not a object: ${target}`);
    return target;
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  const existProxy = reactiveMap.get(target);
  if (existProxy) {
    return existProxy;
  }

  const proxy = new Proxy(target, proxyHandler);

  reactiveMap.set(target, proxy);

  return proxy;
}
