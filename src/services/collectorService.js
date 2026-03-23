// src/services/collectorService.js

const { collectReliefWeb } = require("./collectors/reliefWebService");
const { collectDevPost} = require("./collectors/devpostWebService");
const { collectEuOpenData} = require("./collectors/euopendataWebService");

/**
 * Central collector runner
 * Each collector must expose a named async function
 */
const collectors = [
  {
    name: "ReliefWeb API",
    run: collectReliefWeb
  },
  { 
    name: "DevPost API",
    run: collectDevPost
  },
  { 
    name: "EuOpenData API",
    run: collectEuOpenData
  },
];

const runCollector = async () => {
  console.log("🚀 Collector started");

  for (const collector of collectors) {
    try {
      console.log(`🌍 ${collector.name} collector started`);
      await collector.run();
      console.log(`✅ ${collector.name} collector finished`);
    } catch (error) {
      console.error(
        `❌ ${collector.name} collector failed:`,
        error.response?.status || error.message
      );
    }
  }

  console.log("🏁 Collector finished");
};

module.exports = { runCollector };
