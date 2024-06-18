const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultCommandTimeout: 52000,
    execTimeout: 90000,
    pageLoadTimeout: 140000,
    requestTimeout: 80000,
    responseTimeout: 80000,
  },
  viewportHeight: 900,
  viewportWidth: 1200,
});
