// Mock for react-tweet — prevents vitest from trying to load
// .module.css files that react-tweet imports as ESM.
// react-tweet is a transitive dependency of 'novel' (v1.0.2).

import React from "react";

export function Tweet() {
  return React.createElement("div", { "data-testid": "mock-tweet" });
}

export default {
  Tweet,
};
