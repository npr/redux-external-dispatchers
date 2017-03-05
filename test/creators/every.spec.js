import expect from 'expect';
import { every } from '../../src';

describe('creators/every', () => {
  it('does nothing if not applied to a store', () => {
    const get = expect.createSpy();
    const register = expect.createSpy();
    const actionCreator = expect.createSpy();
    
    const externalDispatcher = every({ get, register, actionCreator });

    expect(get).toNotHaveBeenCalled('uninitialized external dispatcher should not call get');
    expect(register).toNotHaveBeenCalled('uninitialized external dispatcher should not call register');
    expect(actionCreator).toNotHaveBeenCalled('uninitialized external dispatcher should not call action creator');
  });

  it('only invokes register when applied to a store', () => {
    const get = expect.createSpy();
    const register = expect.createSpy();
    const actionCreator = expect.createSpy();
    const dispatch = expect.createSpy();
    
    const externalDispatcher = every({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(get).toNotHaveBeenCalled('initialized external dispatcher should not call get');
    expect(register).toHaveBeenCalled('initialized external dispatcher should call register');
    expect(register.calls.length).toEqual(1, 'initialized external dispatcher should call register only once');
    expect(actionCreator).toNotHaveBeenCalled('initialized external dispatcher should not call action creator');
  });

  it('calls get if the register callback is called', () => {
    const get = expect.createSpy();
    const register = (callback) => callback();
    const actionCreator = expect.createSpy();
    const dispatch = expect.createSpy();
    
    const externalDispatcher = every({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(get).toHaveBeenCalled('get should be called on register');
    expect(get.calls.length).toEqual(1, 'get should only be called once on register callback');
  });

  it('calls the action creator with the value from get', () => {
    const get = () => 'test string';
    const register = (callback) => callback();
    const actionCreator = expect.createSpy();
    const dispatch = expect.createSpy();
    
    const externalDispatcher = every({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(actionCreator).toHaveBeenCalled('action creator should be called on register callback');
    expect(actionCreator.calls.length).toEqual(1, 'action creator should only be called once on register callback');
    expect(actionCreator.calls[0].arguments[0]).toEqual('test string', 'action creator should be called with the result of get');
  });

  it('calls dispatch with the result of the action creator', () => {
    const get = () => 'test string';
    const register = (callback) => callback();
    const actionCreator = (value) => ({ type: 'TEST_ACTION', payload: value });
    const dispatch = expect.createSpy();
    
    const externalDispatcher = every({ get, register, actionCreator });
    const appliedExternalDispatcher = externalDispatcher({ dispatch });

    expect(dispatch).toHaveBeenCalled('dispatch should be called on register callback');
    expect(dispatch.calls.length).toEqual(1, 'dispatch should only be called once on register callback');
    expect(dispatch.calls[0].arguments[0]).toEqual({ type: 'TEST_ACTION', payload: 'test string' }, 'dispatch should be called with the result of the action creator');
  });
});
