import { raise } from "~/shared/exceptions.ts";

class Injector {
  private intanceMap: Record<string, unknown> = {};

  register<T>(factory: Factory<T>): Injector {
    this.set(factory);
    return this;
  }

  get<T>(factory: Factory<T>): T {
    const name = factory.name;
    const instance = this.intanceMap[name] ??
      raise(`'${name}' doesn't not have an instance`);
    return instance as T;
  }

  set<T>(factory: Factory<T>) {
    const name = factory.name;
    if (name in this.intanceMap) return;
    this.intanceMap[name] = new factory();
  }

  drop() {
    for (const key in this.intanceMap) {
      delete this.intanceMap[key];
    }
  }
}

type Factory<T> = new () => T;

export const injector = new Injector();
