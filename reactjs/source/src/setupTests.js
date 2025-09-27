// react-testing-library renders your components to document.body,
// this will ensure they're removed after each test.
// this adds jest-dom's custom assertions
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
