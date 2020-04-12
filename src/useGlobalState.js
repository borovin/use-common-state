/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState, useEffect, useCallback,
} from 'react';
import {
  set, get, toPath,
} from 'lodash';

let globalState = {};
export const localStateSetters = new Map();
const pathToString = (normalizedPath) => JSON.stringify(normalizedPath);
const pathToArray = (stringifiedPath) => JSON.parse(stringifiedPath);

export function initGlobalState(initialState) {
  globalState = initialState;
}

export function setGlobalState(path, updater) {
  const normalizedPath = toPath(path);
  const stringifiedPath = pathToString(normalizedPath);
  const newState = typeof updater === 'function' ? updater(get(globalState, normalizedPath)) : updater;
  set(globalState, normalizedPath, newState);
  localStateSetters.forEach((setterPath, setter) => {
    if (setterPath.includes(stringifiedPath.slice(0, -1))
    || stringifiedPath.includes(setterPath.slice(0, -1))) {
      const state = get(globalState, pathToArray(setterPath));
      setter(state);
    }
  });
}

function useGlobalState(path) {
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
    setGlobalState(normalizedPath, updater);
  }, [stringifiedPath]);

  return [get(globalState, normalizedPath), setState];
}

export default useGlobalState;
