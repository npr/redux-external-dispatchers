
/**
 * @param {{get: Function, register: Function, actionCreator: Function}} creator
 * @returns {Function}
 */
const onChangeStartingWith = ({ get, register, actionCreator }) => startValue => ({ dispatch }) => {
    let cachedValue = startValue;
    register(() => {
        const newValue = get();
        if (typeof newValue !== 'undefined' && newValue !== cachedValue) {
            dispatch(actionCreator(newValue));
            cachedValue = newValue;
        }
    });
};

export default onChangeStartingWith;
