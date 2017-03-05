/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 * 
 * Adapted from https://github.com/reactjs/redux/blob/v3.6.0/src/compose.js
 * Returns a function that takes no arguments and expects the last function
 * to take no arguments.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * () => f(g(h())).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return () => {};
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  const last = funcs[funcs.length - 1];
  const rest = funcs.slice(0, -1);
  return () => rest.reduceRight((composed, f) => f(composed), last());
}
