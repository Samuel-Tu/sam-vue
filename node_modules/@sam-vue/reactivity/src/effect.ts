import { targetMap } from "./reactiveEffect";

function preCleanEffect(effect: ReactiveEffect) {
  effect._depLength = 0;
  effect._trackId++;
}

function cleanDepEffect(dep, effect) {
  dep.delete(effect);
  if (dep.size === 0) {
    dep.cleanup();
  }
}

class ReactiveEffect {
  _trackId = 0;
  public active = true;
  _depLength = 0;
  deps = [];

  constructor(public fn, public scheduler) {}

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
}

export let currentReactiveEffect;

export function effect(fn, option?) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });

  _effect.run();

  return _effect;
}

export function trackEffect(effect, dep) {
  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId);
    //   const oleDep = effect.deps[effect._depLength];
    //   if (oleDep !== dep) {
    //     if (oleDep) {
    //       cleanDepEffect(dep, effect);
    //     }
    //     effect.deps[effect._depLength++] = dep;
    //   } else {
    //     effect._depLength++;
    //   }
  }
  dep.set(effect, effect._trackId);
  effect.deps[effect._depLength++] = dep;
  // debugger;
  console.log(effect.deps, "deps");
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      console.log(effect, "effect");
      console.log(targetMap, "targetMap");
      effect.scheduler();
    }
  }
}
