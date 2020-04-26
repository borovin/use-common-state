# use-common-state

![build](https://github.com/borovin/use-common-state/workflows/build/badge.svg)
[![codecov](https://codecov.io/gh/borovin/use-common-state/branch/master/graph/badge.svg)](https://codecov.io/gh/borovin/use-common-state)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/81b8beba838242558dfea2ba8f0276a1)](https://www.codacy.com/manual/borovin/use-global-state?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=borovin/use-global-state&amp;utm_campaign=Badge_Grade)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Cross-component common state management without context.

## Why?
Current implementations of the React state management seem to be overcomplicated and redundant for most of the regular web apps. A lot of boilerplate/configuration code needs to be written before getting and updating common state. Thanks to the incredibly elegant `useState()` hook the mechanism of synchronizing local component states can be significantly simplified and doesn't require any additional code outside the component. It also makes components more reusable across different applications since there are no additional requirements to the app architecture and no needs in the top context providers.

## Examples
* https://codesandbox.io/s/use-common-state-1-p0gp6
* https://codesandbox.io/s/use-common-state-2-ugcgi
* https://codesandbox.io/s/use-common-state-3-hk46l

## Install
```
npm install use-common-state
```


