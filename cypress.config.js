const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173/',
  },
  env: {
    databaseResetUrl: "http://backend:4000/test/reset-test-database"
  },
  viewportHeight: 900,
  viewportWidth: 1200,
});
