// React 19 requires this to be set in the test environment so that
// state updates triggered from async callbacks (e.g. AsyncStorage.getItem)
// are wrapped correctly by act() inside @testing-library/react-native.
global.IS_REACT_ACT_ENVIRONMENT = true;
