# use-common-state

![build](https://github.com/borovin/use-common-state/workflows/build/badge.svg)
[![codecov](https://codecov.io/gh/borovin/use-common-state/branch/master/graph/badge.svg)](https://codecov.io/gh/borovin/use-common-state)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/81b8beba838242558dfea2ba8f0276a1)](https://www.codacy.com/manual/borovin/use-global-state?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=borovin/use-global-state&amp;utm_campaign=Badge_Grade)
[![Code style airbnb](https://img.shields.io/badge/code%20style-airbnb-blue)](https://github.com/airbnb/javascript/tree/master/react)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Cross-component common state management without context.

## Why?
Current implementations of the React state management seem to be overcomplicated and redundant for most of the regular web apps. A lot of boilerplate/configuration code needs to be written before getting and updating common state. Thanks to the incredibly elegant `useState()` hook the mechanism of synchronizing local component states can be significantly simplified and doesn't require any additional code outside the component. It also makes components more reusable across different applications since there are no additional requirements to the app architecture and no needs in the top context providers.

## Install
```
npm install use-common-state
```

## Usage
You can use common state hook inside your functional component without any additional wrappers nor setup:
```
import React from "react";
import useCommonState from "use-common-state";

const FirstName = () => {
  const [firstName, setFirstName] = useCommonState("user.firstName", "Default name");

  return <div>{firstName}</div>;
};
```
It's recomended, but not mandatory to specify the state property you need, so the component will be rerendered only when this specific property is updated (reference identity is used). 
`useCommonState` function has similar syntax to the [lodash get()](https://lodash.com/docs/4.17.15#get). The first argument is the path of the state property to get (Array|string). 
The second is the value returned for undefined resolved values (default value). And returns the array of `[value, setter]` similar to the regular [React useState hook](https://reactjs.org/docs/hooks-state.html). You can get get/set the common state properties in any component, no matter where it's placed in the components tree. See the full example here: https://codesandbox.io/s/use-common-state-1-p0gp6

It's also possible to update the common state outside the component, which is handy for global actions like fetching/initializing data:
```
import React from "react";
import { setCommonState } from "use-common-state";
import {FirstName, LastName, Input} from "../components";

const fetchUser = () => {
  setCommonState({ isLoadingUser: true });
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
In complex web apps, when managing huge data structures and working with different APIs you will likely need to split monolithic common state into small independent parts.
It could help you to avoid naming collisions, code conflicts, increase performance and share different common states as an independent modules. 
For this case you can use `createCommonState` fabric function which returns the array of `[useCommonStateHook, commonStateSetter]`. The optional argument is initial common state value:
```
import React from "react";
import { createCommonState } from "use-common-state";
import {FirstName, LastName, Input} from "../components";

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
