import {
  useState, useEffect, useCallback,
} from 'react';
import {
  set, get, toPath,
} from 'lodash';

const commonStates = [];
const pathToString = (normalizedPath) => JSON.stringify(normalizedPath);
const pathToArray = (stringifiedPath) => JSON.parse(stringifiedPath);

export function initCommonState(initialState) {
  commonStates[0] = initialState;
}

export function createCommonState(initialState = {}) {
  const commonStateId = commonStates.length;
  const localStateSetters = new Map();

  commonStates[commonStateId] = initialState;

  function setCommonState(path, updater) {
    const commonState = commonStates[commonStateId];
    const normalizedPath = toPath(path);
    const stringifiedPath = pathToString(normalizedPath);
    const prevState = get(commonState, normalizedPath);
    const newState = typeof updater === 'function' ? updater(get(commonState, normalizedPath)) : updater;

    if (prevState === newState) {
      return;
    }

    set(commonState, normalizedPath, newState);

    localStateSetters.forEach((setterPath, setter) => {
      if (setterPath.includes(stringifiedPath.slice(0, -1))
      || stringifiedPath.includes(setterPath.slice(0, -1))) {
        const state = get(commonState, pathToArray(setterPath));
        setter(state);
      }
    });
  }

  function useCommonState(path, defaultValue) {
    const commonState = commonStates[commonStateId];
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

    return [get(commonState, normalizedPath, defaultValue), setState];
  }

  return [useCommonState, setCommonState];
}

const commonState = createCommonState();

export const setCommonState = commonState[1];

export default commonState[0];
