const { defineConfig } = require("cypress");
const net = require("net");

const DEFAULT_DB_HOST =
  process.env.CYPRESS_DB_HOST ?? process.env.MARIADB_HOST ?? "127.0.0.1";
const DEFAULT_DB_PORT = Number(
  process.env.CYPRESS_DB_PORT ?? process.env.MARIADB_PORT ?? 3306,
);
const DEFAULT_DB_WAIT_TIMEOUT_MS = Number(
  process.env.CYPRESS_DB_WAIT_TIMEOUT ?? 30_000,
);

const RETRY_DELAY_MS = 1_000;
const SOCKET_TIMEOUT_MS = 2_000;

/**
 * @param {{ host?: string; port?: number; timeoutMs?: number }} [options]
 * @param {{ dbHost?: string; dbPort?: number; dbWaitTimeoutMs?: number }} [env]
 */
async function waitForDatabase(options = {}, env = {}) {
  const host = options.host ?? env.dbHost ?? DEFAULT_DB_HOST;
  const port = Number(options.port ?? env.dbPort ?? DEFAULT_DB_PORT);
  const timeoutMs = Number(
    options.timeoutMs ?? env.dbWaitTimeoutMs ?? DEFAULT_DB_WAIT_TIMEOUT_MS,
  );

  if (!Number.isFinite(port)) {
    throw new Error(`Invalid database port provided for waitForDbHealthy: ${port}`);
  }

  const deadline = Date.now() + timeoutMs;

  return new Promise((resolve, reject) => {
    const attemptConnection = () => {
      const socket = net.createConnection({ host, port });

      const cleanup = () => {
        socket.removeAllListeners();
      };

      const scheduleRetry = (error) => {
        cleanup();
        socket.destroy();

        if (Date.now() >= deadline) {
          reject(
            new Error(
              `Timed out waiting for MariaDB at ${host}:${port} (${error.message})`,
            ),
          );
          return;
        }

        setTimeout(attemptConnection, RETRY_DELAY_MS);
      };

      socket.once("connect", () => {
        cleanup();
        socket.end();
        resolve(null);
      });

      socket.once("error", scheduleRetry);
      socket.setTimeout(SOCKET_TIMEOUT_MS, () => {
        scheduleRetry(new Error("Connection attempt timed out"));
      });
    };

    attemptConnection();
  });
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)

      on('task', {
        waitForDbHealthy(options) {
          return waitForDatabase(options, config.env)
        },
      })

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config
    },
    baseUrl: 'http://localhost:5173/',
  },
  env: {
    databaseResetUrl: "http://localhost:4000/test/reset-test-database",
    dbHost: DEFAULT_DB_HOST,
    dbPort: DEFAULT_DB_PORT,
    dbWaitTimeoutMs: DEFAULT_DB_WAIT_TIMEOUT_MS,
  },
  viewportHeight: 900,
  viewportWidth: 1200,
});
