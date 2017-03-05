
/**
 * Creates a store enhancer that injects `dispatch` into external dispatcher
 * functions. This is handy for getting browser state updates from outside of
 * your Redux app without having to expose the entire state.
 *
 * Because this injects the `dispatch` method returned from previously applied
 * store enhancers, this should be one of the last store enhancers that you apply.
 * For example, if you are applying middlewares, you want to apply external
 * dispatchers after the middlewares so that actions dispatched from external
 * dispatchers will go through all middlewares as expected.
 *
 * Note that each external dispatcher will be given the `dispatch` function
 * as a named argument.
 *
 * @param {...Function} dispatchers Each external dispatcher to set up.
 * @returns {Function} A store enhancer applying the external dispatchers.
 */
export default function applyExternalDispatchers(...dispatchers) {
  return (createStore) => (reducer, initialState, enhancer) => {
    var store = createStore(reducer, initialState, enhancer);
    var dispatch = store.dispatch;

    var externalDispatcherApi = {
      dispatch: (action) => dispatch(action)
    };

    dispatchers.map(dispatcher => dispatcher(externalDispatcherApi));

    return {
      ...store,
      dispatch
    }
  };
}
