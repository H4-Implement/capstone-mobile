import { registerRootComponent } from 'expo';
import 'react-native-url-polyfill/auto';

import App from './App';
import { Buffer } from "buffer";
if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
