import {
  useState, useEffect, useCallback,
} from 'react';
import {
  set, get, toPath,
} from 'lodash';

const commonStates = [];
const pathToString = (normalizedPath) => JSON.stringify(normalizedPath);
const pathToArray = (stringifiedPath) => JSON.parse(stringifiedPath);

export function createCommonState(initialState = {}) {
  const commonStateId = commonStates.length;
  const localStateSetters = new Map();

  commonStates[commonStateId] = initialState;

  function setCommonState(_path, _updater) {
    const updater = _updater || _path;
    const path = _updater ? _path : null;
    const normalizedPath = toPath(path);
    const stringifiedPath = pathToString(normalizedPath);
    const prevState = normalizedPath.length
      ? get(commonStates[commonStateId], normalizedPath) : commonStates[commonStateId];
    const newState = typeof updater === 'function' ? updater(prevState) : updater;

    if (prevState === newState) {
      return;
    }

    if (normalizedPath.length) {
      set(commonStates[commonStateId], normalizedPath, newState);
    } else {
      commonStates[commonStateId] = newState;
    }

    localStateSetters.forEach((setterPath, localStateSetter) => {
      if (setterPath.includes(stringifiedPath.slice(0, -1))
      || stringifiedPath.includes(setterPath.slice(0, -1))) {
        const state = get(commonStates[commonStateId], pathToArray(setterPath));
        localStateSetter(state);
      }
    });
  }

  function useCommonState(path, defaultValue) {
    const normalizedPath = toPath(path);
    const stringifiedPath = pathToString(normalizedPath);
    const localStateSetter = useState()[1];

    useEffect(() => function cleanup() {
      localStateSetters.delete(localStateSetter);
    }, []);

    useEffect(() => {
      localStateSetters.set(localStateSetter, stringifiedPath);
    }, [stringifiedPath]);

    const setState = useCallback((updater) => {
      setCommonState(normalizedPath, updater);
    }, [stringifiedPath]);

    return [normalizedPath.length
      ? get(commonStates[commonStateId], normalizedPath, defaultValue)
      : commonStates[commonStateId], setState];
  }

  return [useCommonState, setCommonState];
}

const commonState = createCommonState();

export const setCommonState = commonState[1];

export default commonState[0];
