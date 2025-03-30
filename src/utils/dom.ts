/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 * A TypeScript and modified version of the VanJS project.
 *
 * This version only retains the functionality for:
 *  - state creation and derivation
 *  - DOM updates via add and hydrate
 *  - tag generation (tags)
 */

/**
 * --- Exported Types ---
 * Only types required by the exported API are kept.
 */

export type State<T> = {
  val: T;
  readonly oldVal: T;
  rawVal: T;
  _oldVal: T;
  _bindings: Array<Binding>;
  _listeners: Array<Listener<T>>;
};

export type StateView<T> = Readonly<State<T>>;

export type ChildDom =
  | (string | number | boolean | null | undefined)
  | Node
  | StateView<string | number | boolean | null | undefined>
  | BindingFunc
  | readonly ChildDom[];

export type TagFunc<Result> = (
  first?: (Props & PropsWithKnownKeys<Result>) | ChildDom,
  ...rest: readonly ChildDom[]
) => Result;

export type Tags = Readonly<Record<string, TagFunc<Element>>> & {
  [K in keyof HTMLElementTagNameMap]: TagFunc<HTMLElementTagNameMap[K]>;
};

export type NamespaceFunction = (
  namespaceURI: string
) => Readonly<Record<string, TagFunc<Element>>>;

/**
 * --- Internal Types ---
 * These types support the internal binding and updating mechanisms.
 */
type BindingFunc = ((dom?: Node) => ChildDom) | ((dom?: Element) => Element);

type Props = Record<string, any> & { class?: any };
type PropsWithKnownKeys<ElementType> = Partial<{
  [K in keyof ElementType]: any;
}>;

type ConnectedDom = { isConnected: number };

type Binding = {
  f: BindingFunc;
  _dom: HTMLElement | null | undefined;
};

type Listener<T> = {
  f: BindingFunc;
  s: State<T>;
  _dom?: HTMLElement | null | undefined;
};

type Connectable<T> = Listener<T> | Binding;

type Dependencies<T> = {
  _getters: Set<State<T>>;
  _setters: Set<State<T>>;
};

type PropertyDescriptorSearchFn<T> = (
  proto: T
) => ReturnType<typeof Object.getOwnPropertyDescriptor> | undefined;
type EventSetterFn = (
  v: EventListenerOrEventListenerObject,
  oldV?: EventListenerOrEventListenerObject
) => void;
type PropSetterFn = (value: any) => void;

/**
 * --- Internal Variables ---
 */
let changedStates: Set<State<any>> | undefined;
let derivedStates: Set<State<any>>;
let curDeps: Dependencies<any>;
let curNewDerives: Array<any>;
let forGarbageCollection: Set<any> | undefined;

let _undefined: undefined;
const _object = Object;
const _document = document;
const protoOf = _object.getPrototypeOf;
const alwaysConnectedDom: ConnectedDom = { isConnected: 1 };
const gcCycleInMs = 1000;
const propSetterCache: { [key: string]: (<T>(v: T) => void) | 0 } = {};
const funcProto = Function.prototype;

/**
 * --- Internal Helper Functions ---
 */
const addAndScheduleOnFirst = <T>(
  set: Set<State<T>> | undefined,
  state: State<T>,
  fn: () => void,
  waitMs?: number
): Set<State<T>> => {
  if (set === undefined) {
    setTimeout(fn, waitMs);
    set = new Set<State<T>>();
  }
  set.add(state);
  return set;
};

const runAndCaptureDependencies = <T>(fn: Function, deps: Dependencies<T>, arg: T): T => {
  const prevDeps = curDeps;
  curDeps = deps;
  try {
    return fn(arg);
  } catch (e) {
    console.error(e);
    return arg;
  } finally {
    curDeps = prevDeps;
  }
};

const keepConnected = <T extends Connectable<T>>(l: T[]): T[] => {
  return l.filter((b) => b._dom?.isConnected);
};

const addForGarbageCollection = <T>(discard: State<T>): void => {
  forGarbageCollection = addAndScheduleOnFirst(
    forGarbageCollection,
    discard,
    () => {
      if (forGarbageCollection) {
        for (const s of forGarbageCollection) {
          s._bindings = keepConnected(s._bindings);
          s._listeners = keepConnected(s._listeners);
        }
        forGarbageCollection = _undefined;
      }
    },
    gcCycleInMs
  );
};

/**
 * --- State and Derivation ---
 */
const stateProto = {
  get val() {
    const state = this as State<unknown>;
    curDeps?._getters?.add(state);
    return state.rawVal;
  },
  get oldVal() {
    const state = this as State<unknown>;
    curDeps?._getters?.add(state);
    return state._oldVal;
  },
  set val(v) {
    const state = this as State<unknown>;
    curDeps?._setters?.add(state);
    if (v !== state.rawVal) {
      state.rawVal = v;
      state._bindings.length + state._listeners.length
        ? (derivedStates?.add(state),
          (changedStates = addAndScheduleOnFirst(changedStates, state, updateDoms)))
        : (state._oldVal = v);
    }
  },
};

const statePropertyDescriptor = <T>(value: T): PropertyDescriptor => ({
  writable: true,
  configurable: true,
  enumerable: true,
  value: value,
});

export const state = <T>(initVal?: T): State<T> => {
  return _object.create(stateProto, {
    rawVal: statePropertyDescriptor(initVal),
    _oldVal: statePropertyDescriptor(initVal),
    _bindings: statePropertyDescriptor([]),
    _listeners: statePropertyDescriptor([]),
  });
};

const bind = <T>(f: Function, dom?: T | undefined): T => {
  const deps: Dependencies<any> = { _getters: new Set(), _setters: new Set() };
  const binding: { [key: string]: any } = { f };
  const prevNewDerives = curNewDerives;
  curNewDerives = [];
  let newDom = runAndCaptureDependencies(f, deps, dom);
  newDom = ((newDom ?? _document) as Node).nodeType
    ? newDom
    : new Text(newDom as string | undefined);
  for (const d of deps._getters)
    deps._setters.has(d) || (addForGarbageCollection(d as any), (d as any)._bindings.push(binding));
  for (const l of curNewDerives) l._dom = newDom;
  curNewDerives = prevNewDerives;
  return (binding._dom = newDom);
};

export const derive = <T>(f: () => T, s?: State<T>, dom?: ChildDom): State<T> => {
  s = s ?? state();
  const deps: Dependencies<T> = { _getters: new Set(), _setters: new Set() };
  const listener: { [key: string]: any } = { f, s };
  listener._dom = dom ?? curNewDerives?.push(listener) ?? alwaysConnectedDom;
  s.val = runAndCaptureDependencies(f, deps, s.rawVal);
  for (const d of deps._getters)
    deps._setters.has(d) ||
      (addForGarbageCollection(d), d._listeners.push(listener as Listener<T>));
  return s;
};

/**
 * --- DOM Manipulation ---
 */
export const add = (dom: Element, ...children: readonly ChildDom[]): Element => {
  for (const c of (children as any).flat(Infinity)) {
    const protoOfC = protoOf(c ?? 0);
    const child =
      protoOfC === stateProto ? bind(() => c.val) : protoOfC === funcProto ? bind(c) : c;
    child != _undefined && dom.append(child);
  }
  return dom;
};

const update = <T>(dom: T, newDom: T): void => {
  newDom
    ? newDom !== dom && (dom as HTMLElement).replaceWith(newDom as string | Node)
    : (dom as HTMLElement).remove();
};

const updateDoms = () => {
  let iter = 0,
    derivedStatesArray = changedStates
      ? [...changedStates].filter((s) => s.rawVal !== s._oldVal)
      : [];
  do {
    derivedStates = new Set();
    for (const l of new Set(
      derivedStatesArray.flatMap((s) => (s._listeners = keepConnected(s._listeners)))
    ))
      derive(l.f, l.s, l._dom), (l._dom = _undefined);
  } while (++iter < 100 && (derivedStatesArray = [...derivedStates]).length);
  const changedStatesArray = changedStates
    ? [...changedStates].filter((s) => s.rawVal !== s._oldVal)
    : [];
  changedStates = _undefined;
  for (const b of new Set(
    changedStatesArray.flatMap((s) => (s._bindings = keepConnected(s._bindings)))
  )) {
    b._dom && update(b._dom, bind(b.f, b._dom)), (b._dom = _undefined);
  }
  for (const s of changedStatesArray) s._oldVal = s.rawVal;
};

export const hydrate = <T extends Node>(
  dom: T,
  updateFn: (dom: T) => T | null | undefined
): T | void => {
  return update(dom, bind(updateFn, dom));
};

/**
 * --- Tag Creation ---
 */
const tag = (ns: string | null, name: string, ...args: any): Element => {
  const [props, ...children] =
    protoOf(args[0] ?? 0) === _object.getPrototypeOf({}) ? args : [{}, ...args];
  const dom: Element = ns ? _document.createElementNS(ns, name) : _document.createElement(name);
  // eslint-disable-next-line prefer-const
  for (let [k, v] of _object.entries(props)) {
    const getDesc: PropertyDescriptorSearchFn<any> = (proto: any) =>
      proto
        ? (_object.getOwnPropertyDescriptor(proto, k as PropertyKey) ?? getDesc(protoOf(proto)))
        : _undefined;
    const cacheKey = `${name},${k}`;
    const propSetter =
      propSetterCache[cacheKey] ?? (propSetterCache[cacheKey] = getDesc(protoOf(dom))?.set ?? 0);
    const setter: PropSetterFn | EventSetterFn = k.startsWith("on")
      ? (v: EventListenerOrEventListenerObject, oldV?: EventListenerOrEventListenerObject) => {
          const event = k.slice(2);
          if (oldV) dom.removeEventListener(event, oldV);
          dom.addEventListener(event, v);
        }
      : propSetter
        ? propSetter.bind(dom)
        : dom.setAttribute.bind(dom, k);
    let protoOfV = protoOf(v ?? 0);
    if (!k.startsWith("on") && protoOfV === funcProto) {
      v = derive(v as BindingFunc);
      protoOfV = stateProto;
    }
    protoOfV === stateProto
      ? bind(() => (setter((v as any).val, (v as any)._oldVal), dom))
      : setter(v as EventListenerOrEventListenerObject);
  }
  return add(dom, ...children);
};

const proxyHandler = (namespace?: string): ProxyHandler<object> => {
  return {
    get: (_: never, name: string) => tag.bind(_undefined, namespace ?? null, name),
  };
};

export const tags = new Proxy(
  (namespace?: string) => new Proxy(tag, proxyHandler(namespace)) as NamespaceFunction,
  proxyHandler()
) as Tags & NamespaceFunction;
