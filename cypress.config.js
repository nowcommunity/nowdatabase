const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultCommandTimeout: 12000,
    execTimeout: 90000,
    pageLoadTimeout: 140000,
    requestTimeout: 9000,
    responseTimeout: 45000,
  },
});
