import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("🚀 Starting OIC Contracts Deployment...\n");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying with account: ${await deployer.getAddress()}`);
  console.log(`💰 Balance: ${(await deployer.getBalance()).toString()}\n`);

  // 1. Deploy OIC Token
  console.log("1️⃣  Deploying OICToken...");
  const OICToken = await ethers.getContractFactory("OICToken");
  const token = await OICToken.deploy();
  await token.deployed();
  console.log(`   ✅ OICToken deployed to: ${token.address}\n`);

  // 2. Deploy Treasury
  console.log("2️⃣  Deploying OICTreasury...");
  const Treasury = await ethers.getContractFactory("OICTreasury");
  const treasury = await Treasury.deploy(token.address);
  await treasury.deployed();
  console.log(`   ✅ Treasury deployed to: ${treasury.address}\n`);

  // 3. Deploy Staking
  console.log("3️⃣  Deploying OICStaking...");
  const Staking = await ethers.getContractFactory("OICStaking");
  const staking = await Staking.deploy(token.address, treasury.address);
  await staking.deployed();
  console.log(`   ✅ OICStaking deployed to: ${staking.address}\n`);

  // 4. Deploy Registry
  console.log("4️⃣  Deploying OICAdherenceRegistry...");
  const Registry = await ethers.getContractFactory("OICAdherenceRegistry");
  const registry = await Registry.deploy(staking.address, treasury.address);
  await registry.deployed();
  console.log(`   ✅ OICAdherenceRegistry deployed to: ${registry.address}\n`);

  // 5. Deploy Timelock
  console.log("5️⃣  Deploying TimelockController...");
  const Timelock = await ethers.getContractFactory("TimelockController");
  const timelock = await Timelock.deploy(
    0, // min delay
    [await deployer.getAddress()], // proposers
    [await deployer.getAddress()] // executors
  );
  await timelock.deployed();
  console.log(`   ✅ TimelockController deployed to: ${timelock.address}\n`);

  // 6. Deploy Governance
  console.log("6️⃣  Deploying OICGovernance...");
  const Governance = await ethers.getContractFactory("OICGovernance");
  const governance = await Governance.deploy(token.address, timelock.address);
  await governance.deployed();
  console.log(`   ✅ OICGovernance deployed to: ${governance.address}\n`);

  // Summary
  console.log("=".repeat(60));
  console.log("📋 Deployment Summary");
  console.log("=".repeat(60));
  console.log(`OICToken:              ${token.address}`);
  console.log(`Treasury:              ${treasury.address}`);
  console.log(`OICStaking:            ${staking.address}`);
  console.log(`OICAdherenceRegistry:  ${registry.address}`);
  console.log(`TimelockController:    ${timelock.address}`);
  console.log(`OICGovernance:         ${governance.address}`);
  console.log("=".repeat(60) + "\n");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    deployer: await deployer.getAddress(),
    contracts: {
      OICToken: token.address,
      Treasury: treasury.address,
      OICStaking: staking.address,
      OICAdherenceRegistry: registry.address,
      TimelockController: timelock.address,
      OICGovernance: governance.address,
    },
  };

  // Write to file (if not in CI)
  const fs = require("fs");
  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  fs.writeFileSync(
    `${deploymentsDir}/${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`💾 Deployment info saved to: deployments/${network.name}.json`);
}

main()
  .then(() => {
    console.log("✅ Deployment complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
