const { CronJob } = require('cron');

const app = require('./app');
const migrationsManager = require('./migrations');
const config = require('./config');
const { sendCongratulationsEmails } = require('./app/services/users');
const {
  cronExpresions: { everyMidnight }
} = require('./app/constants');
const logger = require('./app/logger');

const port = config.common.api.port || 8080;
const {
  common: {
    api: { timezone }
  }
} = config;

const congratulationsEmailsJob = new CronJob(everyMidnight, sendCongratulationsEmails, null, false, timezone);

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(() => {
    congratulationsEmailsJob.start();
    app.listen(port);

    logger.info(`Listening on port: ${port}`);
  })
  .catch(logger.error);
