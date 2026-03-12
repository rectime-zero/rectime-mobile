module.exports = api => {
  const isTest = api.env('test');
  api.cache(() => isTest);

  return {
    presets: isTest
      ? ['module:@react-native/babel-preset']
      : ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: ['react-native-worklets/plugin'],
  };
};
