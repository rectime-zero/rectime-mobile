const React = require('react');
const {View} = require('react-native');

const AnimatedView = React.forwardRef(function AnimatedView(props, ref) {
  return React.createElement(View, {...props, ref}, props.children);
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

module.exports = {
  __esModule: true,
  default: {
    View: AnimatedView,
  },
  useSharedValue: value => ({value}),
  useAnimatedStyle: updater => updater(),
  withSpring: value => value,
  withTiming: (value, _config, callback) => {
    if (callback) {
      callback(true);
    }

    return value;
  },
  interpolate,
  runOnJS: fn => fn,
};
