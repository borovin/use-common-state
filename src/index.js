import { useState, useEffect, useCallback } from 'react';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _set from 'lodash/fp/set';

const commonStates = [];

function get(obj, path, defaultValue) {
  return _isNil(path) ? obj : _get(obj, path, defaultValue);
}

function set(obj, path, value) {
  return _isNil(path) ? value : _set(path)(value)(obj);
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
