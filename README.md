# redux-external-dispatchers

A Redux store enhancer to let non-Redux pieces of your application dispatch actions into Redux without also having access to Redux state.

### Why should I use this?

On [NPR.org](http://www.npr.org), we embedded a Redux app into our broader non-Redux web site experience.

We found that middleware is an OK integration point between the Redux app and non-Redux concerns. However, middleware is a very powerful tool: it provides dispatch capabilities AND a window into Redux state.

When you just need to tell the Redux part of your app what the non-Redux part is doing, all you really need is dispatch. If you only need to dispatch, then you also don't need the overhead of executing middleware code on every action.

This can also help you keep a bright line between effectful code and pure code.

### Examples

##### Browser document visibility
Bind a handler to the document's visibilitychange event that tells your Redux app whether it is visible to the user.

```javascript
import BrowserActions from '../lib/Browser/actions';

let visibility = document.visibilityState;

export default function visibilityDispatcher({ dispatch }) {
  document.addEventListener('visibilitychange', function onResize() {
    const currentVisibility = document.visibilityState;
    if (currentVisibility !== visibility) {
      dispatch(BrowserActions.onVisibilityChanged(currentVisibility));
      visibility = currentVisibility;
    }
  });
};
```

##### Browser viewport breakpoint
Bind a handler to the window resize event that tells your Redux app what the current breakpoint is (mobile, tablet, desktop, etc.).

```javascript
import BrowserActions from '../lib/Browser/actions';
import Breakpoints from '../lib/constants/Breakpoints';

function getBreakpointFromWidth(width) {
  if (width < 768) {
    return Breakpoints.SMALL;
  } else if (width < 1024) {
    return Breakpoints.MEDIUM;
  } else {
    return Breakpoints.LARGE;
  }
}

let breakpoint = getBreakpointFromWidth(window.innerWidth);

export default function viewportDispatcher({ dispatch }) {
  window.addEventListener('onresize', function onResize() {
    const currentBreakpoint = getBreakpointFromWidth(window.innerWidth);
    if (currentBreakpoint !== breakpoint) {
      dispatch(BrowserActions.onBreakpointChanged(currentBreakpoint));
      breakpoint = currentBreakpoint;
    }
  });
};
```

##### Content environment
Since we embedded a Redux app into an existing web site, we already had a tested non-Redux system for page navigation. To tell our app whether we were on a news page, music page, etc., we bound a handler to our page navigation event and dispatched an action notifying Redux about the content environment.

```javascript
import $ from 'jquery';
import NavigationActions from '../lib/Navigation/actions';

export default function contentEnvDispatcher({ dispatch }) {
  window.addEventListener('hashchange', function onHashChange() {
    const environment = $('section.main-section').attr('id');
    dispatch(NavigationActions.onContentEnvironmentChanged(environment));
  });
};
```

##### Advertising integration
If you control the markup for advertising, you can bind an event handler to interactions on a non-Redux advertisement and notify the Redux app about them. This was one of the ways we supported playing sponsored content in our audio player app on the web site.

```javascript
import AudioActions from '../lib/Audio/actions';

export default function adAudioDispatcher({ dispatch }) {
  document.addEventListener('app:ads:loaded', function () {
    const adIframe = document.querySelector('#ad iframe');
    if (adIframe && adIframe.contentDocument) {
      const audioElement = adIframe.contentDocument.querySelector('[data-ad-audio]');
      if (audioElement && audioElement.getAttribute('data-ad-audio')) {
        AudioActions.play(audioElement.getAttribute('data-ad-audio'));
      } 
    }
  });
};
```

### Wiring to your Redux store

You hook this library into your app like any other store enhancer: as the third argument to Redux's `createStore`.
```javascript
import { createStore } from 'redux';
import { applyExternalDispatchers } from 'redux-external-dispatchers';

import rootReducer from './reducer';
import { timer, message } from './external-dispatchers';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyExternalDispatchers(timer, message),
  );
};
```

If you are already using one store enhancer, you will need to use Redux's `compose` to compose all of your store enhancers together.

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import { applyExternalDispatchers } from 'redux-external-dispatchers';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from './reducer';
import { timer, message } from './external-dispatchers';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, createLogger()),
      applyExternalDispatchers(timer, message)
    )
  );
};
```

### Dependencies
There is only a peer dependency on Redux 3.1.0 or later. Redux 3.1.0 introduced a nicer store enhancer API that made this project easier to integrate into existing Redux apps.

### Acknowledgements
[@justinbach](https://github.com/justinbach): genesis of the external dispatcher concept and leadership for its implementation on [NPR.org](http://www.npr.org).

### License
MIT
