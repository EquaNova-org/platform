const axios = require("axios");
const crypto = require("crypto");
const Opportunity = require("../../models/Opportunity");

const RELIEFWEB_API = "https://api.reliefweb.int/v1/jobs";

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
async function collectReliefWeb() {
  console.log("🌍 ReliefWeb API collector started");

  let response;

  try {
    response = await axios.post(
      RELIEFWEB_API,
      {
        appname: "equanova-platform",
        query: {
          value: "internship",
          fields: ["title", "body", "url", "source"]
        },
        limit: 50
      },
      {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "EquaNova/1.0 (contact@equanova.org)"
        }
      }
    );
  } catch (err) {
    console.error("❌ ReliefWeb API error:", err.message);
    return;
  }

  const jobs = response.data?.data || [];
  let saved = 0;

  for (const item of jobs) {
    const title = item.fields?.title;
    const description = item.fields?.body;
    const link = item.fields?.url;
    const provider = item.fields?.source?.[0]?.name || "ReliefWeb";

    if (!title || !link) continue;

    const contentHash = hashContent(title + link);

    const exists = await Opportunity.findOne({ contentHash });
    if (exists) continue;

    await Opportunity.create({
      title,
      type: "internship",
      provider,
      description,
      source: {
        name: "ReliefWeb",
        sourceUrl: link
      },
      contentHash,
      verified: true
    });

    saved++;
  }

  console.log(`✅ ReliefWeb API saved ${saved} opportunities`);
}

module.exports = { collectReliefWeb };