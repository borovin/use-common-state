import { useState, useEffect, useCallback } from 'react';

const commonStates = [];

function isNil(value) {
  return typeof value === 'undefined' || value === null;
}

function pathToArray(path) {
  switch (typeof path) {
    case 'string':
      return path.split('.');
    case 'number':
      return [path];
    default:
      return path;
  }
}

function get(obj, path, defaultValue) {
  if (isNil(path)) {
    return obj;
  }

  const pathArray = pathToArray(path);

  const value = pathArray.slice().reduce((nested, key, i, arr) => {
    const result = nested[key];
    if (result === null || typeof result === 'undefined') {
      arr.splice(1);
    }
    return result || defaultValue;
  }, obj);

  return value;
}

function set(obj, path, value) {
  if (isNil(path)) {
    return value;
  }

  const pathArray = pathToArray(path);

  if (!pathArray.length) {
    return value;
  }

  const result = Array.isArray(obj) ? obj.slice() : { ...obj };

  result[pathArray[0]] = set(result[pathArray[0]], pathArray.slice(1), value);

  return result;
}

export function createCommonState(initialState = {}) {
  const commonStateId = commonStates.length;
  const localStateSetters = new Map();

  commonStates[commonStateId] = initialState;

  function setCommonState(_path, _updater) {
    const path = _updater ? _path : null;
    const updater = _updater || _path;
    const prevValue = get(commonStates[commonStateId], path);
    const newValue = typeof updater === 'function' ? updater(prevValue) : updater;

    if (prevValue === newValue) {
      return;
    }

    commonStates[commonStateId] = set(commonStates[commonStateId], path, newValue);

    localStateSetters.forEach((localStatePath, localStateSetter) => localStateSetter(get(commonStates[commonStateId], localStatePath)));
  }

  function useCommonState(path, defaultValue) {
    const value = get(commonStates[commonStateId], path, defaultValue);
    const localStateSetter = useState(value)[1];

    useEffect(() => function cleanup() {
      localStateSetters.delete(localStateSetter);
    }, []);

    useEffect(() => {
      localStateSetters.set(localStateSetter, path);
    }, [path, localStateSetter]);

    const setState = useCallback((updater) => {
      setCommonState(path, updater);
    }, [path]);

    return [value, setState];
  }

  return [useCommonState, setCommonState];
}

const commonState = createCommonState();

export const setCommonState = commonState[1];

export default commonState[0];
