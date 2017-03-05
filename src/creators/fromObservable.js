

/**
 * @param {Observable} observable
 * @param {{next: Function, error?: Function, complete?: Function}} actionCreators
 * @returns {ExternalDispatcherAPI}
 */
const fromObservable = (observable, actionCreators) => ({ dispatch }) => {
    if (!actionCreators.next || typeof actionCreators.next !== 'function') {
        throw new Error(`fromObservable second argument must have at least a "next" action creator`);
    }
    
    const observer = {
        next: (value) => dispatch(actionCreators.next(value))
    };

    if (actionCreators.error && typeof actionCreators.error === 'function') {
        observer.error = (errorValue) => dispatch(actionCreators.error(errorValue))
    };

    if (actionCreators.complete && typeof actionCreators.complete === 'function') {
        observer.complete = () => dispatch(actionCreators.complete())
    };

    observable.subscribe(observer);
};

export default fromObservable;
