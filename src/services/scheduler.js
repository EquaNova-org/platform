const cron = require("node-cron");
const { runCollector } = require("./collectorService");

let task;

const startScheduler = () => {
  if (task) return;

  task = cron.schedule("0 */6 * * *", async () => {
    console.log("⏱ Scheduled collector triggered");
    await runCollector();
  });

  console.log("⏱ Scheduler started");
};

const stopScheduler = () => {
  if (task) {
    task.stop();
    task = null;
  }
};

module.exports = { startScheduler, stopScheduler };
