import expect from 'expect';
import { createStore } from 'redux';
import applyExternalDispatchers from '../src/applyExternalDispatchers';

/* Extracted from redux test helpers */
function id(state = []) {
  return state.reduce((result, item) => (
    item.id > result ? item.id : result
  ), 0) + 1
}

/* Extracted from redux test helpers */
function todosReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: id(state),
          text: action.text
        }
      ];
    default:
      return state
  }
}

/* Extracted from redux test helpers */
function addTodo(text) {
  return { type: 'ADD_TODO', text }
}

describe('applyExternalDispatchers', () => {
  it('only exposes dispatch via its API', () => {
    const spy = expect.createSpy();
    applyExternalDispatchers(spy)(createStore)(todosReducer);

    expect(spy.calls.length).toEqual(1);
    expect(Object.keys(spy.calls[0].arguments[0])).toEqual(['dispatch']);
  });

  it('works the same as any store dispatch', () => {
    let smuggledDispatch;

    const testExternalDispatcher = ({dispatch}) => {
      smuggledDispatch = dispatch;
    };

    const spy = expect.createSpy().andCall(testExternalDispatcher);
    const store = applyExternalDispatchers(spy)(createStore)(todosReducer);

    store.dispatch(addTodo('Use Redux'));
    store.dispatch(addTodo('Flux FTW!'));

    expect(store.getState()).toEqual([
      { id: 1, text: 'Use Redux' },
      { id: 2, text: 'Flux FTW!' }
    ]);

    smuggledDispatch(addTodo('Go external'));

    expect(store.getState()).toEqual([
      { id: 1, text: 'Use Redux' },
      { id: 2, text: 'Flux FTW!' },
      { id: 3, text: 'Go external' }
    ]);
  });
});
