const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, _config) {
      require('@cypress/code-coverage/task')(on, _config)

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return _config
    },
    baseUrl: 'http://localhost:5173/',
  },
  env: {
    databaseResetUrl: "http://localhost:4000/test/reset-test-database"
  },
  viewportHeight: 900,
  viewportWidth: 1200,
});
