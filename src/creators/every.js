import compose from '../compose';
/**
 * @param {{get: Function, register: Function, actionCreator: Function}} creator
 * @returns {ExternalDispatcherAPI}
 */
const every = ({ get, register, actionCreator }) => ({ dispatch }) => {
    const composedDispatch = compose(dispatch, actionCreator, get);
    register(() => composedDispatch());
};

export default every;
