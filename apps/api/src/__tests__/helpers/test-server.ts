/**
 * Test Server Helper
 * Creates isolated Express app instances for integration testing
 */
import { Application } from "express";
import { createApp } from "../../app";

/**
 * Creates a test instance of the Express application
 * Returns a clean app instance with all routes and middleware configured
 */
export const createTestServer = (): Application => {
  return createApp();
};

/**
 * Test server singleton for reuse across test suites
 */
let testApp: Application;

export const getTestServer = (): Application => {
  if (!testApp) {
    testApp = createTestServer();
  }
  return testApp;
};

/**
 * Reset test server instance (useful between test suites)
 */
export const resetTestServer = (): void => {
  testApp = createTestServer();
};
