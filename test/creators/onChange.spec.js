import expect from 'expect';
import { onChange } from '../../src';

describe('creators/onChange', () => {
  it('does nothing if not applied to a store', () => {
    const get = expect.createSpy();
    const register = expect.createSpy();
    const actionCreator = expect.createSpy();
    
    const externalDispatcher = onChange({ get, register, actionCreator });

    expect(get).toNotHaveBeenCalled('uninitialized external dispatcher should not call get');
    expect(register).toNotHaveBeenCalled('uninitialized external dispatcher should not call register');
    expect(actionCreator).toNotHaveBeenCalled('uninitialized external dispatcher should not call action creator');
  });

  it('invokes only get and register when applied to a store', () => {
    const get = expect.createSpy();
    const register = expect.createSpy();
    const actionCreator = expect.createSpy();
    const dispatch = expect.createSpy();
    
    const externalDispatcher = onChange({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(get).toHaveBeenCalled('initialized external dispatcher should call get to get initial value');
    expect(get.calls.length).toEqual(1, 'initialized external dispatcher should call get only once to get initial value');
    expect(register).toHaveBeenCalled('initialized external dispatcher should call register');
    expect(register.calls.length).toEqual(1, 'initialized external dispatcher should call register only once');
    expect(actionCreator).toNotHaveBeenCalled('initialized external dispatcher should not call action creator');
  });

  it('calls get if the register callback is called', () => {
    const get = expect.createSpy();
    const register = (callback) => callback();
    const actionCreator = expect.createSpy();
    const dispatch = expect.createSpy();
    
    const externalDispatcher = onChange({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(get).toHaveBeenCalled('get should be called on register callback');
    expect(get.calls.length).toEqual(2, 'get should only be called once on creation and once on register callback');
  });

  it('calls the action creator with the new value from get if it changed', () => {
    let calls = 0;
    const changingFunction = () => {
        calls += 1;
        return `test string ${calls}`;
    }
    const get = expect.createSpy().andCall(changingFunction);
    const register = (callback) => callback();
    const actionCreator = expect.createSpy();
    const dispatch = expect.createSpy();
    
    const externalDispatcher = onChange({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(actionCreator).toHaveBeenCalled('action creator should be called on register callback');
    expect(actionCreator.calls.length).toEqual(1, 'action creator should only be called once on register callback');
    expect(actionCreator.calls[0].arguments[0]).toEqual('test string 2', 'action creator should be called with the changed result of get');
  });

  it('does not call the action creator if the get value did not change', () => {
    const nonChangingFunction = () => 'test string 1';
    const get = expect.createSpy().andCall(nonChangingFunction);
    const register = (callback) => callback();
    const actionCreator = expect.createSpy();
    const dispatch = expect.createSpy();
    
    const externalDispatcher = onChange({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(actionCreator).toNotHaveBeenCalled('action creator should not be called if get value does not change');
  });

  it('calls dispatch with the result of the action creator', () => {
    let calls = 0;
    const changingFunction = () => {
        calls += 1;
        return `test string ${calls}`;
    }
    const get = expect.createSpy().andCall(changingFunction);
    const register = (callback) => callback();
    const actionCreator = (value) => ({ type: 'TEST_ACTION', payload: value });
    const dispatch = expect.createSpy();
    
    const externalDispatcher = onChange({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(dispatch).toHaveBeenCalled('dispatch should be called on register callback');
    expect(dispatch.calls.length).toEqual(1, 'dispatch should only be called once on register callback');
    expect(dispatch.calls[0].arguments[0]).toEqual({ type: 'TEST_ACTION', payload: 'test string 2' }, 'dispatch should be called with the result of the action creator');
  });
});
