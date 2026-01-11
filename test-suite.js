const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedTreasuryFlow + ZK Health Identity", function () {
    let mneeToken, zkIdentity, medTreasury;
    let owner, doctor, nurse, finance, vendor;
    let proofHash;

    beforeEach(async function () {
        [owner, doctor, nurse, finance, vendor] = await ethers.getSigners();
        
        // Deploy MNEE Token
        const MNEEToken = await ethers.getContractFactory("MNEEToken");
        mneeToken = await MNEEToken.deploy(1000000);
        await mneeToken.deployed();

        // Deploy ZK Health Identity
        const ZKHealthIdentity = await ethers.getContractFactory("ZKHealthIdentity");
        zkIdentity = await ZKHealthIdentity.deploy();
        await zkIdentity.deployed();

        // Deploy MedTreasuryFlow
        const MedTreasuryFlow = await ethers.getContractFactory("MedTreasuryFlow");
        medTreasury = await MedTreasuryFlow.deploy(mneeToken.address, zkIdentity.address);
        await medTreasury.deployed();

        // Fund treasury
        await mneeToken.approve(medTreasury.address, ethers.utils.parseEther("100000"));
        await medTreasury.fundTreasury(ethers.utils.parseEther("100000"));

        // Generate proof hash
        proofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("demo-proof"));
    });

    describe("ZK Health Identity", function () {
        it("Should issue credentials correctly", async function () {
            await zkIdentity.issueCredential(
                doctor.address,
                "DOCTOR",
                proofHash,
                365 * 24 * 60 * 60
            );

            expect(await zkIdentity.hasRole(doctor.address, "DOCTOR")).to.be.true;
        });

        it("Should verify ZK proofs", async function () {
            await zkIdentity.issueCredential(
                doctor.address,
                "DOCTOR",
                proofHash,
                365 * 24 * 60 * 60
            );

            expect(
                await zkIdentity.verifyZKProof(doctor.address, "DOCTOR", proofHash)
            ).to.be.true;
        });

        it("Should revoke credentials", async function () {
            await zkIdentity.issueCredential(
                doctor.address,
                "DOCTOR",
                proofHash,
                365 * 24 * 60 * 60
            );

            await zkIdentity.revokeCredential(doctor.address, "DOCTOR");
            expect(await zkIdentity.hasRole(doctor.address, "DOCTOR")).to.be.false;
        });

        it("Should detect expired credentials", async function () {
            await zkIdentity.issueCredential(
                doctor.address,
                "DOCTOR",
                proofHash,
                1 // 1 second validity
            );

            await new Promise(resolve => setTimeout(resolve, 2000));
            expect(await zkIdentity.hasRole(doctor.address, "DOCTOR")).to.be.false;
        });

        it("Should only allow issuers to create credentials", async function () {
            await expect(
                zkIdentity.connect(doctor).issueCredential(
                    nurse.address,
                    "NURSE",
                    proofHash,
                    365 * 24 * 60 * 60
                )
            ).to.be.revertedWith("Not an issuer");
        });
    });

    describe("Treasury Management", function () {
        it("Should fund treasury correctly", async function () {
            const balance = await medTreasury.treasuryBalance();
            expect(balance).to.equal(ethers.utils.parseEther("100000"));
        });

        it("Should create expense requests", async function () {
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);
            
            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("5000"),
                "Medical supplies",
                0, // MEDICAL_SUPPLIES
                vendor.address
            );

            const request = await medTreasury.getRequest(1);
            expect(request.amount).to.equal(ethers.utils.parseEther("5000"));
            expect(request.requester).to.equal(doctor.address);
        });

        it("Should reject requests without credentials", async function () {
            await expect(
                medTreasury.connect(doctor).createRequest(
                    ethers.utils.parseEther("5000"),
                    "Medical supplies",
                    0,
                    vendor.address
                )
            ).to.be.revertedWith("Not authorized");
        });
    });

    describe("Approval Workflow", function () {
        beforeEach(async function () {
            // Issue credentials to all roles
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(nurse.address, "NURSE", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(finance.address, "FINANCE", proofHash, 365 * 24 * 60 * 60);

            // Create a request
            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("5000"),
                "Medical supplies",
                0,
                vendor.address
            );
        });

        it("Should allow doctor approval with ZK proof", async function () {
            await medTreasury.connect(doctor).doctorApprove(1);
            const status = await medTreasury.getApprovalStatus(1);
            expect(status.doctor).to.be.true;
        });

        it("Should allow nurse verification with ZK proof", async function () {
            await medTreasury.connect(nurse).nurseVerify(1);
            const status = await medTreasury.getApprovalStatus(1);
            expect(status.nurse).to.be.true;
        });

        it("Should allow finance approval with ZK proof", async function () {
            await medTreasury.connect(finance).financeApprove(1);
            const status = await medTreasury.getApprovalStatus(1);
            expect(status.finance).to.be.true;
        });

        it("Should reject approvals without credentials", async function () {
            await expect(
                medTreasury.connect(vendor).doctorApprove(1)
            ).to.be.revertedWith("Not authorized");
        });

        it("Should update status after all approvals", async function () {
            await medTreasury.connect(doctor).doctorApprove(1);
            await medTreasury.connect(nurse).nurseVerify(1);
            await medTreasury.connect(finance).financeApprove(1);

            const request = await medTreasury.getRequest(1);
            expect(request.status).to.equal(1); // APPROVED
        });
    });

    describe("Fund Release", function () {
        beforeEach(async function () {
            // Setup: issue credentials and create + approve request
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(nurse.address, "NURSE", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(finance.address, "FINANCE", proofHash, 365 * 24 * 60 * 60);

            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("5000"),
                "Medical supplies",
                0,
                vendor.address
            );

            await medTreasury.connect(doctor).doctorApprove(1);
            await medTreasury.connect(nurse).nurseVerify(1);
            await medTreasury.connect(finance).financeApprove(1);
        });

        it("Should release funds after all approvals", async function () {
            const balanceBefore = await mneeToken.balanceOf(vendor.address);
            
            await medTreasury.releaseFunds(1);
            
            const balanceAfter = await mneeToken.balanceOf(vendor.address);
            expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther("5000"));
        });

        it("Should update treasury balance after release", async function () {
            const treasuryBefore = await medTreasury.treasuryBalance();
            
            await medTreasury.releaseFunds(1);
            
            const treasuryAfter = await medTreasury.treasuryBalance();
            expect(treasuryBefore.sub(treasuryAfter)).to.equal(ethers.utils.parseEther("5000"));
        });

        it("Should update request status to COMPLETED", async function () {
            await medTreasury.releaseFunds(1);
            
            const request = await medTreasury.getRequest(1);
            expect(request.status).to.equal(3); // COMPLETED
        });

        it("Should not release without all approvals", async function () {
            // Create new request without approvals
            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("1000"),
                "Test",
                0,
                vendor.address
            );

            await expect(
                medTreasury.releaseFunds(2)
            ).to.be.revertedWith("Not approved");
        });

        it("Should not release with insufficient balance", async function () {
            // Create request larger than balance
            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("200000"),
                "Large purchase",
                0,
                vendor.address
            );

            await medTreasury.connect(doctor).doctorApprove(2);
            await medTreasury.connect(nurse).nurseVerify(2);
            await medTreasury.connect(finance).financeApprove(2);

            await expect(
                medTreasury.releaseFunds(2)
            ).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("Events", function () {
        beforeEach(async function () {
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);
        });

        it("Should emit RequestCreated event", async function () {
            await expect(
                medTreasury.connect(doctor).createRequest(
                    ethers.utils.parseEther("5000"),
                    "Medical supplies",
                    0,
                    vendor.address
                )
            ).to.emit(medTreasury, "RequestCreated");
        });

        it("Should emit RequestApproved event", async function () {
            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("5000"),
                "Medical supplies",
                0,
                vendor.address
            );

            await expect(
                medTreasury.connect(doctor).doctorApprove(1)
            ).to.emit(medTreasury, "RequestApproved");
        });

        it("Should emit CredentialIssued event", async function () {
            await expect(
                zkIdentity.issueCredential(nurse.address, "NURSE", proofHash, 365 * 24 * 60 * 60)
            ).to.emit(zkIdentity, "CredentialIssued");
        });
    });

    describe("Edge Cases", function () {
        it("Should handle multiple requests sequentially", async function () {
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(nurse.address, "NURSE", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(finance.address, "FINANCE", proofHash, 365 * 24 * 60 * 60);

            // Create multiple requests
            for (let i = 0; i < 3; i++) {
                await medTreasury.connect(doctor).createRequest(
                    ethers.utils.parseEther("1000"),
                    `Request ${i}`,
                    0,
                    vendor.address
                );
            }

            expect(await medTreasury.requestCounter()).to.equal(3);
        });

        it("Should handle zero-amount requests", async function () {
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);

            await expect(
                medTreasury.connect(doctor).createRequest(
                    0,
                    "Invalid request",
                    0,
                    vendor.address
                )
            ).to.be.revertedWith("Amount must be positive");
        });

        it("Should prevent double approvals", async function () {
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);
            
            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("5000"),
                "Test",
                0,
                vendor.address
            );

            await medTreasury.connect(doctor).doctorApprove(1);
            
            // Try to approve again - should revert
            await expect(
                medTreasury.connect(doctor).doctorApprove(1)
            ).to.be.revertedWith("Invalid status");
        });
    });

    describe("Security", function () {
        it("Should only allow admin to release funds", async function () {
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(nurse.address, "NURSE", proofHash, 365 * 24 * 60 * 60);
            await zkIdentity.issueCredential(finance.address, "FINANCE", proofHash, 365 * 24 * 60 * 60);

            await medTreasury.connect(doctor).createRequest(
                ethers.utils.parseEther("5000"),
                "Test",
                0,
                vendor.address
            );

            await medTreasury.connect(doctor).doctorApprove(1);
            await medTreasury.connect(nurse).nurseVerify(1);
            await medTreasury.connect(finance).financeApprove(1);

            await expect(
                medTreasury.connect(vendor).releaseFunds(1)
            ).to.be.revertedWith("Only admin");
        });

        it("Should only allow admin to add issuers", async function () {
            await expect(
                zkIdentity.connect(doctor).addIssuer(nurse.address)
            ).to.be.revertedWith("Only admin");
        });

        it("Should validate vendor address", async function () {
            await zkIdentity.issueCredential(doctor.address, "DOCTOR", proofHash, 365 * 24 * 60 * 60);

            await expect(
                medTreasury.connect(doctor).createRequest(
                    ethers.utils.parseEther("5000"),
                    "Test",
                    0,
                    ethers.constants.AddressZero
                )
            ).to.be.revertedWith("Invalid vendor");
        });
    });
});