const createGesture = () => {
  const chain = {
    enabled: () => chain,
    activeOffsetX: () => chain,
    activeOffsetY: () => chain,
    failOffsetX: () => chain,
    failOffsetY: () => chain,
    onStart: () => chain,
    onUpdate: () => chain,
    onEnd: () => chain,
    onFinalize: () => chain,
  };

  return chain;
};

function GestureHandlerRootView({children}) {
  return children;
}

function GestureDetector({children}) {
  return children;
}

module.exports = {
  GestureHandlerRootView,
  GestureDetector,
  Gesture: {
    Pan: createGesture,
  },
};
