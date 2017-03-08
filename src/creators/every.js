/**
 * @param {{get: Function, register: Function, actionCreator: Function}} creator
 * @returns {ExternalDispatcherAPI}
 */
const every = ({ get, register, actionCreator }) => ({ dispatch }) => {
    register(() => {
        const value = get();
        if (typeof value !== 'undefined') {
            dispatch(actionCreator(value));
        }
    });
};

export default every;
