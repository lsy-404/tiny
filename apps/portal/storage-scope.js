// Keeps each project's Web Storage under its own "<scope>:" key prefix on the shared origin.
(() => {
  const { scope, adopt } = document.currentScript.dataset;
  const prefix = `${scope}:`;

  const scoped = (native) => {
    const own = () => Object.keys(native).filter((key) => key.startsWith(prefix));
    const api = {
      getItem: (key) => native.getItem(prefix + String(key)),
      setItem: (key, value) => native.setItem(prefix + String(key), value),
      removeItem: (key) => native.removeItem(prefix + String(key)),
      clear: () => own().forEach((key) => native.removeItem(key)),
      key: (index) => own()[Number(index)]?.slice(prefix.length) ?? null,
    };
    const target = Object.create(Storage.prototype);
    return new Proxy(target, {
      get: (_, name, receiver) => {
        if (name === 'length') return own().length;
        if (Object.hasOwn(api, name)) return api[name];
        if (typeof name === 'symbol' || name in target) return Reflect.get(target, name, receiver);
        return native.getItem(prefix + name) ?? undefined;
      },
      set: (_, name, value) => (typeof name === 'symbol' ? Reflect.set(target, name, value) : (api.setItem(name, value), true)),
      has: (_, name) => (typeof name === 'symbol' ? name in target : name in target || native.getItem(prefix + name) !== null),
      deleteProperty: (_, name) => (typeof name === 'symbol' ? Reflect.deleteProperty(target, name) : (api.removeItem(name), true)),
      ownKeys: () => own().map((key) => key.slice(prefix.length)),
      getOwnPropertyDescriptor: (_, name) => {
        const value = typeof name === 'string' ? api.getItem(name) : null;
        return value === null ? undefined : { value, writable: true, enumerable: true, configurable: true };
      },
    });
  };

  for (const name of ['localStorage', 'sessionStorage']) {
    let native;
    try {
      native = window[name];
    } catch {
      continue;
    }
    if (name === 'localStorage' && adopt) {
      const prefixes = adopt.split(' ');
      for (const key of Object.keys(native)) {
        if (!key.startsWith(prefix) && prefixes.some((legacy) => key.startsWith(legacy))) {
          // Freeing the old key first keeps a nearly full storage from rejecting the copy.
          const value = native.getItem(key);
          native.removeItem(key);
          native.setItem(prefix + key, value);
        }
      }
    }
    const view = scoped(native);
    Object.defineProperty(window, name, { configurable: true, enumerable: true, get: () => view });
  }
})();
