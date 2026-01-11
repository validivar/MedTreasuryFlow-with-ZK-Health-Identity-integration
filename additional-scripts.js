// scripts/deploy-testnet.js
const hre = require("hardhat");

async function main() {
    console.log("🌍 Deploying MedTreasuryFlow to Testnet...");
    console.log("Network:", hre.network.name);
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    // Deploy MNEE Token
    console.log("\n📝 Deploying MNEE Token...");
    const MNEEToken = await hre.ethers.getContractFactory("MNEEToken");
    const mneeToken = await MNEEToken.deploy(1000000);
    await mneeToken.deployed();
    console.log("✅ MNEE Token deployed to:", mneeToken.address);
    
    // Wait for confirmations
    console.log("⏳ Waiting for block confirmations...");
    await mneeToken.deployTransaction.wait(5);
    
    // Deploy ZK Health Identity
    console.log("\n📝 Deploying ZK Health Identity...");
    const ZKHealthIdentity = await hre.ethers.getContractFactory("ZKHealthIdentity");
    const zkIdentity = await ZKHealthIdentity.deploy();
    await zkIdentity.deployed();
    console.log("✅ ZK Health Identity deployed to:", zkIdentity.address);
    await zkIdentity.deployTransaction.wait(5);
    
    // Deploy MedTreasuryFlow
    console.log("\n📝 Deploying MedTreasuryFlow...");
    const MedTreasuryFlow = await hre.ethers.getContractFactory("MedTreasuryFlow");
    const medTreasury = await MedTreasuryFlow.deploy(mneeToken.address, zkIdentity.address);
    await medTreasury.deployed();
    console.log("✅ MedTreasuryFlow deployed to:", medTreasury.address);
    await medTreasury.deployTransaction.wait(5);
    
    console.log("\n🎉 Testnet Deployment Complete!");
    console.log("\n📋 Contract Addresses:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("MNEE Token:         ", mneeToken.address);
    console.log("ZK Health Identity: ", zkIdentity.address);
    console.log("MedTreasuryFlow:    ", medTreasury.address);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Verify contracts
    console.log("\n🔍 Verifying contracts on block explorer...");
    console.log("Run these commands to verify:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${mneeToken.address} 1000000`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${zkIdentity.address}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${medTreasury.address} ${mneeToken.address} ${zkIdentity.address}`);
    
    // Save deployment info
    const fs = require('fs');
    const deploymentInfo = {
        network: hre.network.name,
        deployer: deployer.address,
        contracts: {
            mneeToken: mneeToken.address,
            zkIdentity: zkIdentity.address,
            medTreasury: medTreasury.address
        },
        timestamp: new Date().toISOString(),
        blockNumbers: {
            mneeToken: mneeToken.deployTransaction.blockNumber,
            zkIdentity: zkIdentity.deployTransaction.blockNumber,
            medTreasury: medTreasury.deployTransaction.blockNumber
        }
    };
    
    fs.writeFileSync(
        `deployment-${hre.network.name}.json`,
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`\n💾 Deployment info saved to deployment-${hre.network.name}.json`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// ═══════════════════════════════════════════════════════════════

// scripts/simulate-workflow.js
const hre = require("hardhat");

async function main() {
    console.log("🎬 Simulating Complete MedTreasuryFlow Workflow...\n");
    
    const [deployer, doctor, nurse, finance, vendor] = await hre.ethers.getSigners();
    
    // Deploy contracts
    console.log("📦 Deploying contracts...");
    const MNEEToken = await hre.ethers.getContractFactory("MNEEToken");
    const mneeToken = await MNEEToken.deploy(1000000);
    await mneeToken.deployed();
    
    const ZKHealthIdentity = await hre.ethers.getContractFactory("ZKHealthIdentity");
    const zkIdentity = await ZKHealthIdentity.deploy();
    await zkIdentity.deployed();
    
    const MedTreasuryFlow = await hre.ethers.getContractFactory("MedTreasuryFlow");
    const medTreasury = await MedTreasuryFlow.deploy(mneeToken.address, zkIdentity.address);
    await medTreasury.deployed();
    
    console.log("✅ Contracts deployed\n");
    
    // Fund treasury
    console.log("💰 Funding treasury with 100,000 MNEE...");
    await mneeToken.approve(medTreasury.address, hre.ethers.utils.parseEther("100000"));
    await medTreasury.fundTreasury(hre.ethers.utils.parseEther("100000"));
    console.log("✅ Treasury funded\n");
    
    // Issue ZK credentials
    console.log("🔐 Issuing ZK credentials...");
    const proofHash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("demo-proof"));
    const oneYear = 365 * 24 * 60 * 60;
    
    await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, oneYear);
    console.log("  ✓ Doctor credential issued");
    
    await zkIdentity.issueCredential(nurse.address, "NURSE", proofHash, oneYear);
    console.log("  ✓ Nurse credential issued");
    
    await zkIdentity.issueCredential(finance.address, "FINANCE", proofHash, oneYear);
    console.log("  ✓ Finance credential issued\n");
    
    // Create expense request
    console.log("📋 Creating medical expense request...");
    const amount = hre.ethers.utils.parseEther("5000");
    const tx = await medTreasury.connect(doctor).createRequest(
        amount,
        "Emergency medical supplies - antibiotics",
        0, // MEDICAL_SUPPLIES
        vendor.address
    );
    await tx.wait();
    console.log("✅ Request created (ID: 1)\n");
    
    // Show request details
    const request = await medTreasury.getRequest(1);
    console.log("📊 Request Details:");
    console.log("  Amount:", hre.ethers.utils.formatEther(request.amount), "MNEE");
    console.log("  Type:", ["Medical Supplies", "Medication", "Equipment", "Other"][request.requestType]);
    console.log("  Status:", ["Pending", "Approved", "Rejected", "Completed"][request.status]);
    console.log("  Vendor:", request.vendor);
    console.log();
    
    // Doctor approval
    console.log("👨‍⚕️ Doctor approving request...");
    await medTreasury.connect(doctor).doctorApprove(1);
    let status = await medTreasury.getApprovalStatus(1);
    console.log("  ✓ Doctor approved:", status.doctor);
    
    // Nurse verification
    console.log("👩‍⚕️ Nurse verifying request...");
    await medTreasury.connect(nurse).nurseVerify(1);
    status = await medTreasury.getApprovalStatus(1);
    console.log("  ✓ Nurse verified:", status.nurse);
    
    // Finance approval
    console.log("💼 Finance approving request...");
    await medTreasury.connect(finance).financeApprove(1);
    status = await medTreasury.getApprovalStatus(1);
    console.log("  ✓ Finance approved:", status.finance);
    console.log();
    
    // Check if all approved
    const updatedRequest = await medTreasury.getRequest(1);
    console.log("✅ All approvals complete!");
    console.log("Status:", ["Pending", "Approved", "Rejected", "Completed"][updatedRequest.status]);
    console.log();
    
    // Release funds
    console.log("💸 Releasing funds to vendor...");
    const vendorBalanceBefore = await mneeToken.balanceOf(vendor.address);
    await medTreasury.releaseFunds(1);
    const vendorBalanceAfter = await mneeToken.balanceOf(vendor.address);
    
    console.log("  Vendor balance before:", hre.ethers.utils.formatEther(vendorBalanceBefore), "MNEE");
    console.log("  Vendor balance after:", hre.ethers.utils.formatEther(vendorBalanceAfter), "MNEE");
    console.log("  Amount received:", hre.ethers.utils.formatEther(vendorBalanceAfter.sub(vendorBalanceBefore)), "MNEE");
    console.log();
    
    // Final status
    const finalRequest = await medTreasury.getRequest(1);
    console.log("🎉 Workflow Complete!");
    console.log("Final status:", ["Pending", "Approved", "Rejected", "Completed"][finalRequest.status]);
    
    const treasuryBalance = await medTreasury.treasuryBalance();
    console.log("Treasury balance:", hre.ethers.utils.formatEther(treasuryBalance), "MNEE");
    console.log();
    
    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 WORKFLOW SUMMARY");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ ZK credentials issued: 3");
    console.log("✅ Request created: 1");
    console.log("✅ Approvals completed: 3/3");
    console.log("✅ Funds released: 5,000 MNEE");
    console.log("✅ Time to complete: < 1 minute");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🚀 MedTreasuryFlow: Revolutionizing Healthcare Finance!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// ═══════════════════════════════════════════════════════════════

// scripts/verify-contracts.js
const hre = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("🔍 Verifying Contracts on Block Explorer...\n");
    
    // Load deployment info
    const deploymentFile = `deployment-${hre.network.name}.json`;
    
    if (!fs.existsSync(deploymentFile)) {
        console.error(`❌ Deployment file not found: ${deploymentFile}`);
        console.log("Please run deployment first.");
        return;
    }
    
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    
    console.log("Network:", deployment.network);
    console.log("Deployer:", deployment.deployer);
    console.log();
    
    // Verify MNEE Token
    console.log("📝 Verifying MNEE Token...");
    try {
        await hre.run("verify:verify", {
            address: deployment.contracts.mneeToken,
            constructorArguments: [1000000],
        });
        console.log("✅ MNEE Token verified");
    } catch (error) {
        console.log("⚠️ ", error.message);
    }
    console.log();
    
    // Verify ZK Health Identity
    console.log("📝 Verifying ZK Health Identity...");
    try {
        await hre.run("verify:verify", {
            address: deployment.contracts.zkIdentity,
            constructorArguments: [],
        });
        console.log("✅ ZK Health Identity verified");
    } catch (error) {
        console.log("⚠️ ", error.message);
    }
    console.log();
    
    // Verify MedTreasuryFlow
    console.log("📝 Verifying MedTreasuryFlow...");
    try {
        await hre.run("verify:verify", {
            address: deployment.contracts.medTreasury,
            constructorArguments: [
                deployment.contracts.mneeToken,
                deployment.contracts.zkIdentity
            ],
        });
        console.log("✅ MedTreasuryFlow verified");
    } catch (error) {
        console.log("⚠️ ", error.message);
    }
    
    console.log("\n🎉 Verification complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });