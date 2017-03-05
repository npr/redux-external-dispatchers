import applyExternalDispatchers from './applyExternalDispatchers';
import onChange from './creators/onChange';
import onChangeStartingWith from './creators/onChangeStartingWith';
import every from './creators/every';
import fromObservable from './creators/fromObservable';

export {
  // Store enhancer
  applyExternalDispatchers,

  // External dispatcher creators
  onChange,
  onChangeStartingWith,
  every,
  fromObservable
};
