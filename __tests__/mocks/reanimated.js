const React = require('react');
const {View} = require('react-native');

const AnimatedView = React.forwardRef(function AnimatedView(props, ref) {
  return React.createElement(View, {...props, ref}, props.children);
});

const createAnimatedComponent = Component =>
  React.forwardRef(function AnimatedComponent(props, ref) {
    return React.createElement(Component, {...props, ref}, props.children);
  });

const interpolate = (value, inputRange, outputRange) => {
  if (value <= inputRange[0]) {
    return outputRange[0];
  }

  if (value >= inputRange[inputRange.length - 1]) {
    return outputRange[outputRange.length - 1];
  }

  const progress = (value - inputRange[0]) / (inputRange[1] - inputRange[0]);
  return outputRange[0] + (outputRange[1] - outputRange[0]) * progress;
};

const interpolateColor = (value, inputRange, outputRange) => {
  if (value <= inputRange[0]) {
    return outputRange[0];
  }

  if (value >= inputRange[inputRange.length - 1]) {
    return outputRange[outputRange.length - 1];
  }

  return outputRange[0];
};

module.exports = {
  __esModule: true,
  default: {
    View: AnimatedView,
  },
  createAnimatedComponent,
  useSharedValue: value => ({value}),
  useAnimatedStyle: updater => updater(),
  useAnimatedReaction: () => {},
  withSpring: value => value,
  withTiming: (value, _config, callback) => {
    if (callback) {
      callback(true);
    }

    return value;
  },
  interpolate,
  interpolateColor,
  runOnJS: fn => fn,
};
