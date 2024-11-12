// packages/reactivity/src/warn.ts
function warn(content) {
  console.warn(content);
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/effect.ts
function preCleanEffect(effect2) {
  effect2._depLength = 0;
  effect2._trackId++;
}
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this._trackId = 0;
    this.active = true;
    this._depLength = 0;
    this.deps = [];
  }
  run() {
    if (!this.active) return this.fn();
    let lastReactiveEffect = currentReactiveEffect;
    try {
      debugger;
      currentReactiveEffect = this;
      preCleanEffect(this);
      return this.fn();
    } finally {
      currentReactiveEffect = lastReactiveEffect;
    }
  }
};
var currentReactiveEffect;
function effect(fn, option) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  return _effect;
}
function trackEffect(effect2, dep) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
  }
  dep.set(effect2, effect2._trackId);
  effect2.deps[effect2._depLength++] = dep;
  console.log(effect2.deps, "deps");
}
function triggerEffects(dep) {
  for (const effect2 of dep.keys()) {
    if (effect2.scheduler) {
      console.log(effect2, "effect");
      console.log(targetMap, "targetMap");
      effect2.scheduler();
    }
  }
}

// packages/reactivity/src/reactiveEffect.ts
var targetMap = /* @__PURE__ */ new WeakMap();
var createDep = (cleanup, name) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.name = name;
  return dep;
};
function track(target, property) {
  if (currentReactiveEffect) {
    let propertyMap = targetMap.get(target);
    if (!propertyMap) {
      targetMap.set(target, propertyMap = /* @__PURE__ */ new Map());
    }
    let depsMap = propertyMap.get(property);
    if (!depsMap) {
      propertyMap.set(
        property,
        depsMap = createDep(() => depsMap.delete(property), property)
      );
    }
    trackEffect(currentReactiveEffect, depsMap);
  }
}
function trigger(target, property, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const propertyMap = depsMap.get(property);
  if (propertyMap) {
    triggerEffects(propertyMap);
  }
}

// packages/reactivity/src/baseHandler.ts
var proxyHandler = {
  get(target, property, receiver) {
    if (property === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, property);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    let oldValue = target[property];
    Reflect.set(target, property, value, receiver);
    let newValue = target[property];
    if (oldValue !== newValue) {
      trigger(target, property, newValue, oldValue);
    }
    return Reflect.set(target, property, value, receiver);
  }
};

// packages/reactivity/src/reactivity.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function reactive(target) {
  return createReactiveObject(target);
}
function createReactiveObject(target) {
  if (!isObject(target)) {
    warn(`the target is not a object: ${target}`);
    return target;
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
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
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
