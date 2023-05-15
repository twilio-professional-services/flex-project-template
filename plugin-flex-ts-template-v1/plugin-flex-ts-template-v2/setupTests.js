import 'regenerator-runtime/runtime';
import fetch from 'jest-fetch-mock';
import { resetReduxState } from './test-utils/flex-redux';
import { resetServiceConfiguration } from './test-utils/flex-service-configuration';

// Global test lifecycle handlers
beforeAll(() => {
  fetch.enableMocks();
});

beforeEach(() => {
  fetch.resetMocks();
})

afterEach(() => {
  resetServiceConfiguration();
  resetReduxState();
});