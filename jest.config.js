module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/mocks/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-safe-area-context|react-native-linear-gradient)/)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/rectime-aistudio'],
};
