module.exports = api => {
  const isTest = api.env('test');
  api.cache(() => isTest);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: ['react-native-worklets/plugin'],
  };
};
