// File untuk memperbaiki masalah reset button
const fs = require("fs");
const path = require("path");

// Path relatif ke defaultRules.ts
const defaultRulesPath = path.join(__dirname, "src", "defaultRules.ts");
// Path relatif ke file instructions
const instructionsPath = path.join(
  __dirname,
  ".github",
  "instructions",
  "copilot.instructions.md"
);

// Baca file defaultRules.ts
console.log("Reading default rules from:", defaultRulesPath);
const defaultRulesFile = fs.readFileSync(defaultRulesPath, "utf8");

// Extract DEFAULT_RULES content
const match = defaultRulesFile.match(/DEFAULT_RULES = `([\s\S]*?)`;/);
if (!match) {
  console.error("Could not extract DEFAULT_RULES content");
  process.exit(1);
}

const defaultRules = match[1];
console.log("Default rules extracted, length:", defaultRules.length);
console.log("Preview:", defaultRules.substring(0, 100) + "...");

// Buat direktori jika belum ada
const instructionsDir = path.dirname(instructionsPath);
if (!fs.existsSync(instructionsDir)) {
  console.log("Creating directory:", instructionsDir);
  fs.mkdirSync(instructionsDir, { recursive: true });
}

// Tulis file default rules
console.log("Writing default rules to:", instructionsPath);
fs.writeFileSync(instructionsPath, defaultRules, "utf8");
console.log("Reset completed successfully! Default rules have been restored.");
