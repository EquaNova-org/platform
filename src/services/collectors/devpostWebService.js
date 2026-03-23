const axios = require("axios");
const crypto = require("crypto");
const Opportunity = require("../../models/Opportunity");

const DEVPOST_API = "https://devpost.com/api/hackathons";

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
async function collectDevPost() {
  console.log("🏆 DevPost API collector started");

  let response;

  try {
    response = await axios.get(DEVPOST_API, {
      params: {
        status: "open",
        order_by: "deadline",
        per_page: 50
      },
      timeout: 20000,
      headers: {
        "User-Agent": "EquaNova/1.0 (contact@equanova.org)"
      }
    });
  } catch (err) {
    console.error("❌ DevPost API error:", err.message);
    return;
  }

  const hackathons = response.data?.hackathons || [];
  let saved = 0;

  for (const item of hackathons) {
    const title = item.title;
    const description = item.tagline || item.description || "";
    const link = item.url;
    const provider = item.organization_name || "Devpost";
    const deadline = item.submission_period_dates || null;
    const prize = item.prize_amount || null;

    if (!title || !link) continue;

    const contentHash = hashContent(title + link);

    const exists = await Opportunity.findOne({ contentHash });
    if (exists) continue;

    await Opportunity.create({
      title,
      type: "competition",
      provider,
      description: [description, deadline ? `Deadline: ${deadline}` : null, prize ? `Prize: ${prize}` : null]
        .filter(Boolean)
        .join("\n"),
      source: {
        name: "DevPost",
        sourceUrl: link
      },
      contentHash,
      verified: true
    });

    saved++;
  }

  console.log(`✅ DevPost saved ${saved} opportunities`);
}

module.exports = { collectDevPost };