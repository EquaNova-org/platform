const crypto = require("crypto");

module.exports = function hashContent(text) {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex");
};
