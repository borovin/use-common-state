# use-common-state

![build](https://github.com/borovin/use-common-state/workflows/build/badge.svg)
[![codecov](https://codecov.io/gh/borovin/use-common-state/branch/master/graph/badge.svg)](https://codecov.io/gh/borovin/use-common-state)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/81b8beba838242558dfea2ba8f0276a1)](https://www.codacy.com/manual/borovin/use-global-state?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=borovin/use-global-state&amp;utm_campaign=Badge_Grade)
[![Code style airbnb](https://img.shields.io/badge/code%20style-airbnb-blue)](https://github.com/airbnb/javascript/tree/master/react)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Cross-component common state hook without context providers.

* **Super-small.** 490 bytes (minified and gzipped). No dependencies.
* **Performance-friendly.** Component renders only when required data is changed.
* **Boilerplate-free.** No wrappers, mappers, providers, subscribers, etc... Simple React State Hook without context.

## Why?
Current implementations of the React state management seem to be overcomplicated and redundant for most of the regular web apps. A lot of boilerplate/configuration code needs to be written before getting and updating common state. Thanks to the incredibly elegant `useState()` hook, the mechanism of synchronizing local component states can be significantly simplified and doesn't require any additional code outside the functional component. It also makes components more reusable across different applications since there are no additional requirements to the app architecture and no needs in the top context providers.

## Install
```
npm install use-common-state
```

## Usage
You can use common state hook inside your functional components without any additional wrappers nor setup:
```
import React from "react";
import useCommonState from "use-common-state";

export const FirstName = () => {
  const [firstName] = useCommonState("user.firstName", "Default first name");

  return <div>{firstName}</div>;
};

export const LastName = () => {
  const [lastName] = useCommonState("user.lastName", "Default last name");

  return <div>{lastName}</div>;
};

export const Input = () => {
  const [firstName, setFirstName] = useCommonState("user.firstName");
  const [lastName, setLastName] = useCommonState("user.lastName");

  return (
    <>
      <input value={firstName} placeholder='First name' onChange={e => setFirstName(e.target.value)} />
      <input value={lastName} placeholder='Last name' onChange={e => setLastName(e.target.value)} />
    </>
  );
};
```
It's recomended, but not mandatory, to specify the path of the common state property you need, 
so the component will be rerendered only when this specific property is updated (reference identity is used). 
The first argument of the `useCommonState` is the path of the state property to get (Array|string). 
The second is the value, returned for undefined resolved values (default value). And returns the array of `[value, setter]` similar to the original [React useState hook](https://reactjs.org/docs/hooks-state.html). You can get get/set the common state properties in any component, no matter where it's placed in the components tree. See the full example here: https://codesandbox.io/s/use-common-state-1-p0gp6

It's also possible to update the common state outside the component, which is handy for global actions like fetching/initializing data:
```
import React from "react";
import { setCommonState } from "use-common-state";
import { FirstName, LastName, Input } from "../components";

const fetchUser = () => {
  setCommonState("isLoadingUser", true);
  fetch("path/to/user")
    .then(res => res.json())
    .then(user => setCommonState({user, isLoadingUser: false}))
};

function Page() {
  const [isLoadingUser] = useCommonState("isLoadingUser", true);

  React.useEffect(() => {
    fetchUser();
  }, []);

  return isLoadingUser ? (
    "Loading user..."
  ) : (
    <>
      <FirstName />
      <LastName />
      <Input />
    </>
  );
}
```
See the full example here: https://codesandbox.io/s/use-common-state-2-ugcgi

## Advanced usage
In complex web apps, when managing huge data structures and working with different APIs you will likely think about splitting the monolithic common state into small independent parts.
It could help you to avoid naming collisions, code conflicts, increase performance and share different common states as an independent modules. 
For this purposes you can use `createCommonState` factory function which returns the array of `[useCommonStateHook, commonStateSetter]`. The optional argument is initial common state value:
```
import React from "react";
import { createCommonState } from "use-common-state";
import { FirstName, LastName, Input } from "../components";

const [useUser, setUser] = createCommonState({
  isLoading: true,
});

const fetchUser = () => {
  setUser("isLoading", true);
  fetch("path/to/user")
    .then(res => res.json())
    .then(user => setUser({...user, isLoading: false}))
};

function Page() {
  const [isLoadingUser] = useUser("isLoading");

  React.useEffect(() => {
    fetchUser();
  }, []);

  return isLoadingUser ? (
    "Loading user..."
  ) : (
    <>
      <FirstName />
      <LastName />
      <Input />
    </>
  );
}
```
