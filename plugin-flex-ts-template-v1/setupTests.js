import 'regenerator-runtime/runtime';
import fetch from 'jest-fetch-mock';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { resetReduxState } from './test-utils/flex-redux';
import { resetServiceConfiguration } from './test-utils/flex-service-configuration';

configure({ adapter: new Adapter() });

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