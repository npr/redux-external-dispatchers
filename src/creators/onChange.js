
/**
 * @param {{get: Function, register: Function, actionCreator: Function}} creator
 * @returns {ExternalDispatcherAPI}
 */
const onChange = ({ get, register, actionCreator }) => ({ dispatch }) => {
    let cachedValue = get();
    register(() => {
        const newValue = get();
        if (typeof newValue !== 'undefined' && newValue !== cachedValue) {
            dispatch(actionCreator(newValue));
            cachedValue = newValue;
        }
    });
};

export default onChange;
