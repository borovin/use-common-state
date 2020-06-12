import { useState, useEffect, useCallback } from 'react';

const commonStates = [];

function pathToArray(path) {
  if (Array.isArray(path)) {
    return path;
  }

  if (typeof path === 'string') {
    return path.split('.');
  }

  if (typeof path === 'number') {
    return [path];
  }

  return [];
}

function get(obj, pathArray = [], defaultValue) {
  if (!pathArray.length) {
    return obj;
  }

  const value = pathArray.slice().reduce((nested, key, i, arr) => {
    let result;

    if (nested !== null) {
      result = nested[key];
    }

    if (typeof result === 'undefined') {
      arr.splice(1);
      return defaultValue;
    }

    return result;
  }, obj);

  return value;
}

function set(obj, pathArray = [], value) {
  if (!pathArray.length) {
    return value;
  }

  const key = pathArray[0];
  const result = Array.isArray(obj) ? obj.slice() : ({ ...obj });

  result[key] = set(result[key], pathArray.slice(1), value);

  return result;
}

export function createCommonState(initialState = {}) {
  const commonStateId = commonStates.length;
  const localStateSetters = new Map();

  commonStates[commonStateId] = initialState;

  function setCommonState(path, value) {
    const pathArray = typeof value === 'undefined' ? [] : pathToArray(path);
    const updater = typeof value === 'undefined' ? path : value;
    const prevValue = get(commonStates[commonStateId], pathArray);
    const newValue = typeof updater === 'function' ? updater(prevValue) : updater;

    if (prevValue === newValue) {
      return;
    }

    commonStates[commonStateId] = set(commonStates[commonStateId], pathArray, newValue);

    localStateSetters.forEach((localStatePath, localStateSetter) => localStateSetter(get(commonStates[commonStateId], localStatePath)));
  }

  function useCommonState(path, defaultValue) {
    const pathArray = pathToArray(path);
    const pathString = JSON.stringify(pathArray);
    const value = get(commonStates[commonStateId], pathArray, defaultValue);
    const localStateSetter = useState(value)[1];

    useEffect(() => function cleanup() {
      localStateSetters.delete(localStateSetter);
    }, []);

    useEffect(() => {
      localStateSetters.set(localStateSetter, pathArray);
    }, [pathString, localStateSetter]);

    const setState = useCallback((updater) => {
      setCommonState(pathArray, updater);
    }, [pathString]);

    return [value, setState];
  }

  return [useCommonState, setCommonState];
}

const commonState = createCommonState();

export const setCommonState = commonState[1];

export default commonState[0];
