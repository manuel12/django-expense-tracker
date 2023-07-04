const { defineConfig } = require("cypress");

module.exports = defineConfig({
  experimentalRunAllSpecs: true,
  retries: {
    openMode: 0,
    runMode: 1,
  },
  video: false,
  screenshotOnRunFailure: false,
  projectId: "72wyad",
  viewportWidth: 1000,
  viewportHeight: 600,
  adminUser: "testuser1",
  adminPass: "testpass1",
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:8000/",
    specPattern: "cypress/integration//**/*.{js,jsx,ts,tsx}",
  },
});
