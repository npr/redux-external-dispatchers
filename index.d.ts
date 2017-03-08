import { Action, Dispatch, StoreEnhancer } from 'redux';

export interface ExternalDispatcherAPI<S> {
  dispatch: Dispatch<S>;
}

export type ExternalDispatcher<S> = (api: ExternalDispatcherAPI<S>) => void;

export type ExternalDispatcherCallback = () => void;

export interface ExternalDispatcherCreator<V> {
  get: () => V | undefined,
  register: (callback: ExternalDispatcherCallback) => void,
  actionCreator: (value: V) => Action
}

export interface ObservableDispatcherCreator<V, E> {
  next: (value?: V) => void,
  error?: (errorValue: E) => void,
  complete?: () => void
}

export function applyExternalDispatchers<S>(...dispatchers: Array<ExternalDispatcher<S>>): StoreEnhancer<S>;

export function every<V>(creator: ExternalDispatcherCreator<V>): ExternalDispatcher;
export function onChange<V>(creator: ExternalDispatcherCreator<V>): ExternalDispatcher;
export function onChangeStartingWith<V>(creator: ExternalDispatcherCreator<V>): (initialValue: V) => ExternalDispatcher;
export function fromObservable<V, E>(observable: Observable, creators: ObservableDispatcherCreator<V, E>): ExternalDispatcher;
