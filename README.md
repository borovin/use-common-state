# use-common-state

Cross-component shared state management without context.

## Why?
Current implementations of the React state management seems to be overcomplicated and redundant for most of the regular web apps. A lot of boilerplate/configuration code needs to be written before getting and updating common state. Thanks to the incredibly elegant `useState()` hook the mechanism of synchronizing local component states can be significantly simplified and doesn't require any additional code outside the component. It also makes components more reusable across different applications since there are no additional requirements to the app architecture and no needs in the top context providers.
