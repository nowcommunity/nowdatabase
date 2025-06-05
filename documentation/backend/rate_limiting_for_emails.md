### Rate Limiting For Emails

The app uses [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) middleware to limit the use of the email route. This is to avoid users spamming emails.

The rate limiting is done on a per-user basis and uses the IP address of the user for this. The limit is set inside the [email](../../backend/src/routes/email.ts) route file. Currently, the settings allow one email every 15 seconds (per user).