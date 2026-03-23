const axios = require("axios");
const crypto = require("crypto");
const Opportunity = require("../../models/Opportunity");

const EU_API = "https://data.europa.eu/euodp/en/apiodp/action/package_search";

/* =====================
   Helpers
===================== */
function hashContent(text) {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex");
}

/* =====================
   Collector
===================== */
async function collectEuOpenData() {
  console.log("🇪🇺 EU Open Data collector started");

  const queries = ["Erasmus student exchange", "youth education program", "student scholarship"];
  let saved = 0;

  for (const query of queries) {
    let response;

    try {
      response = await axios.get(EU_API, {
        params: {
          q: query,
          rows: 20
        },
        timeout: 20000,
        headers: {
          "User-Agent": "EquaNova/1.0 (contact@equanova.org)"
        }
      });
    } catch (err) {
      console.error(`❌ EU Open Data API error for query "${query}":`, err.message);
      continue;
    }

    const results = response.data?.result?.results || [];

    for (const item of results) {
      const title = item.title;
      const description = item.notes || item.description || "";
      const link = item.url || `https://data.europa.eu/euodp/en/data/dataset/${item.name}`;
      const provider = item.organization?.title || "EU Open Data";

      if (!title || !link) continue;

      const contentHash = hashContent(title + link);

      const exists = await Opportunity.findOne({ contentHash });
      if (exists) continue;

      await Opportunity.create({
        title,
        type: "university_program",
        provider,
        description,
        source: {
          name: "EU Open Data Portal",
          sourceUrl: link
        },
        contentHash,
        verified: true
      });

      saved++;
    }
  }

  console.log(`✅ EU Open Data saved ${saved} opportunities`);
}

module.exports = { collectEuOpenData };