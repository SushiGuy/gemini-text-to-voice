# Vitest Setup & Configuration

## Overview
Vitest is a modern testing framework optimized for Node.js projects, with a Jest-compatible API that requires minimal configuration changes.

## Framework & Structure

### Test Setup
- **Framework**: Vitest (install via `npm install --save-dev vitest`)
- **Test Directory**: `/tests/`
- **File Naming**: `*.test.js` or `*.spec.js`
- **Configuration**: Add to package.json:
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:watch": "vitest --watch",
      "test:coverage": "vitest --coverage"
    },
    "devDependencies": {
      "vitest": "^1.0.0"
    }
  }
  ```

### Why Vitest?
- **⚡ Lightning-fast**: Significantly faster startup and test execution than Jest
- **👍 Jest-compatible**: Uses the same API (`describe`, `it`, `expect`), so all test examples work without modification
- **🔄 Smart watch mode**: Instant feedback during development
- **📦 Modern**: Excellent ESM support, built for Vite ecosystem
- **🎯 Perfect for Node.js**: Optimized for unit testing utilities and helpers
