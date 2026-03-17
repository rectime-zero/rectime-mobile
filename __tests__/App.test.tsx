/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-gesture-handler', () => require('./mocks/gesture-handler'));
jest.mock('react-native-reanimated', () => require('./mocks/reanimated'));
jest.mock('react-native-safe-area-context', () => require('./mocks/safe-area-context'));
jest.mock('@react-native-vector-icons/fontawesome5', () => 'FontAwesome5');
jest.mock('@callstack/liquid-glass', () => ({
  LiquidGlassView: 'LiquidGlassView',
  isLiquidGlassSupported: false,
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

import App from '../src/navigation/AppRoot';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
