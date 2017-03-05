import { Dispatch, StoreEnhancer } from 'redux';

export interface ExternalDispatcherAPI<S> {
  dispatch: Dispatch<S>;
}

export type ExternalDispatcher<S> = (api: ExternalDispatcherAPI<S>) => void;

export function applyExternalDispatchers<S>(...dispatchers: Array<ExternalDispatcher<S>>): StoreEnhancer<S>;
