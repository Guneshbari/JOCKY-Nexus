export const RANSOMWARE_SCENARIO = {
  id: "scenario-ransomware-canary",
  name: "Multi-Host Ransomware Pre-Encryption Containment",
  description: "Detects early Canary file alterations and stops volume shadow copy deletion across 3 host tiers.",
  initialVector: "Phishing invoice attachment containing malicious shortcut (LNK)",
  targetHosts: ["FIN-WS-44", "DC-PROD-PRIMARY", "CORE-APP-NODE-09"],
  stages: [
    { name: "Initial Dropper", status: "BLOCKED", host: "FIN-WS-44" },
    { name: "Credential Scraping", status: "CONTAINED", host: "DC-PROD-PRIMARY" },
    { name: "Shadow Copy Protection", status: "ACTIVE", host: "FIN-WS-44" },
  ],
}
