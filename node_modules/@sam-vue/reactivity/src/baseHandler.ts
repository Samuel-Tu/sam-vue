import { ReactiveFlags } from "./reactivity";
import { track, trigger } from "./reactiveEffect";

// proxy 需要搭配 Reflect 使用
export const proxyHandler: ProxyHandler<any> = {
  get(target, property, receiver) {
    if (property === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    //依赖收集
    track(target, property);

    // 如果直接设置 target[property] , 这样在对象中访问 this 指向的不是其代理对象，而是原对象，此时不会触发 get
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    let oldValue = target[property];

    Reflect.set(target, property, value, receiver);

    let newValue = target[property];

    if (oldValue !== newValue) {
      //触发更新
      trigger(target, property, newValue, oldValue);
    }

    return Reflect.set(target, property, value, receiver);
  },
};
