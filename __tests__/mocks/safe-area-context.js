const React = require('react');

const defaultFrame = {
  width: 320,
  height: 640,
  x: 0,
  y: 0,
};

const defaultInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const SafeAreaInsetsContext = React.createContext(defaultInsets);
const SafeAreaFrameContext = React.createContext(defaultFrame);

function SafeAreaProvider({children, initialMetrics}) {
  return React.createElement(
    SafeAreaFrameContext.Provider,
    {value: initialMetrics?.frame ?? defaultFrame},
    React.createElement(
      SafeAreaInsetsContext.Provider,
      {value: initialMetrics?.insets ?? defaultInsets},
      children,
    ),
  );
}

SafeAreaProvider.displayName = 'SafeAreaProvider';

function SafeAreaView({children}) {
  return React.createElement(React.Fragment, null, children);
}

SafeAreaView.displayName = 'SafeAreaView';

module.exports = {
  SafeAreaInsetsContext,
  SafeAreaFrameContext,
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics: {
    frame: defaultFrame,
    insets: defaultInsets,
  },
  useSafeAreaInsets: () => React.useContext(SafeAreaInsetsContext),
  useSafeAreaFrame: () => React.useContext(SafeAreaFrameContext),
};
