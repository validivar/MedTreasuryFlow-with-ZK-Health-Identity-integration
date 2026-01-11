# MedTreasuryFlow API Documentation

Complete reference for interacting with MedTreasuryFlow smart contracts.

---

## Table of Contents

1. [Contract Addresses](#contract-addresses)
2. [ZKHealthIdentity Contract](#zkhealthidentity-contract)
3. [MedTreasuryFlow Contract](#medtreasuryflow-contract)
4. [MNEEToken Contract](#mneetoken-contract)
5. [Events Reference](#events-reference)
6. [Error Codes](#error-codes)
7. [Code Examples](#code-examples)

---

## Contract Addresses

### Localhost (Hardhat Network)
```
MNEE Token:          0x5FbDB2315678afecb367f032d93F642f64180aa3
ZK Health Identity:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
MedTreasuryFlow:     0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### Testnet Addresses
*Update after deployment*

---

## ZKHealthIdentity Contract

### Overview
Manages zero-knowledge health credentials for medical staff.

**Contract Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (localhost)

### Data Structures

#### Credential
```solidity
struct Credential {
    string role;           // Role type: "DOCTOR", "NURSE", "FINANCE"
    uint256 issuedAt;     // Timestamp when issued
    uint256 expiresAt;    // Expiration timestamp
    bool isValid;         // Whether credential is active
    bytes32 zkProofHash;  // Hash of ZK proof
}
```

### Functions

#### `issueCredential`
Issues a new ZK credential to a holder.

```solidity
function issueCredential(
    address _holder,
    string memory _role,
    bytes32 _zkProofHash,
    uint256 _validityPeriod
) external onlyIssuer
```

**Parameters:**
- `_holder` (address): Address receiving the credential
- `_role` (string): Role type ("DOCTOR", "NURSE", "FINANCE")
- `_zkProofHash` (bytes32): Hash of the zero-knowledge proof
- `_validityPeriod` (uint256): Validity duration in seconds

**Requirements:**
- Caller must be an authorized issuer
- Holder address must not be zero
- Validity period must be greater than 0

**Example:**
```javascript
const proofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("proof-data"));
const oneYear = 365 * 24 * 60 * 60;

await zkIdentity.issueCredential(
    doctorAddress,
    "DOCTOR",
    proofHash,
    oneYear
);
```

**Events Emitted:**
- `CredentialIssued(holder, role, proofHash)`

---

#### `hasRole`
Checks if an address has a valid role credential.

```solidity
function hasRole(
    address _holder,
    string memory _role
) public view returns (bool)
```

**Parameters:**
- `_holder` (address): Address to check
- `_role` (string): Role to verify

**Returns:**
- `bool`: True if holder has valid, non-expired credential

**Example:**
```javascript
const isDoctor = await zkIdentity.hasRole(address, "DOCTOR");
console.log("Is valid doctor:", isDoctor);
```

---

#### `verifyZKProof`
Verifies a zero-knowledge proof for a credential.

```solidity
function verifyZKProof(
    address _holder,
    string memory _role,
    bytes32 _proof
) public view returns (bool)
```

**Parameters:**
- `_holder` (address): Credential holder
- `_role` (string): Role to verify
- `_proof` (bytes32): Proof hash to verify

**Returns:**
- `bool`: True if proof is valid and credential is active

**Example:**
```javascript
const isValid = await zkIdentity.verifyZKProof(
    doctorAddress,
    "DOCTOR",
    proofHash
);
```

---

#### `revokeCredential`
Revokes a credential, making it invalid.

```solidity
function revokeCredential(
    address _holder,
    string memory _role
) external onlyIssuer
```

**Parameters:**
- `_holder` (address): Address whose credential to revoke
- `_role` (string): Role to revoke

**Example:**
```javascript
await zkIdentity.revokeCredential(doctorAddress, "DOCTOR");
```

**Events Emitted:**
- `CredentialRevoked(holder, role)`

---

#### `addIssuer`
Adds a new credential issuer (admin only).

```solidity
function addIssuer(address _issuer) external onlyAdmin
```

**Parameters:**
- `_issuer` (address): New issuer address

**Example:**
```javascript
await zkIdentity.addIssuer(hospitalAddress);
```

**Events Emitted:**
- `IssuerAdded(issuer)`

---

#### `getCredential`
Retrieves complete credential information.

```solidity
function getCredential(
    address _holder,
    string memory _role
) external view returns (Credential memory)
```

**Returns:**
- `Credential`: Complete credential struct

**Example:**
```javascript
const credential = await zkIdentity.getCredential(doctorAddress, "DOCTOR");
console.log("Issued at:", new Date(credential.issuedAt * 1000));
console.log("Expires at:", new Date(credential.expiresAt * 1000));
console.log("Is valid:", credential.isValid);
```

---

#### `isExpired`
Checks if a credential has expired.

```solidity
function isExpired(
    address _holder,
    string memory _role
) public view returns (bool)
```

**Returns:**
- `bool`: True if credential has passed expiration date

---

## MedTreasuryFlow Contract

### Overview
Main treasury management contract with multi-role approval workflows.

**Contract Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` (localhost)

### Enums

#### RequestType
```solidity
enum RequestType {
    MEDICAL_SUPPLIES,  // 0
    MEDICATION,        // 1
    EQUIPMENT,         // 2
    OTHER             // 3
}
```

#### RequestStatus
```solidity
enum RequestStatus {
    PENDING,    // 0
    APPROVED,   // 1
    REJECTED,   // 2
    COMPLETED   // 3
}
```

### Data Structures

#### ExpenseRequest
```solidity
struct ExpenseRequest {
    uint256 id;
    address requester;
    uint256 amount;
    string description;
    RequestType requestType;
    RequestStatus status;
    uint256 timestamp;
    bool doctorApproved;
    bool nurseVerified;
    bool financeApproved;
    address vendor;
}
```

### Functions

#### `createRequest`
Creates a new expense request.

```solidity
function createRequest(
    uint256 _amount,
    string memory _description,
    RequestType _requestType,
    address _vendor
) external returns (uint256)
```

**Parameters:**
- `_amount` (uint256): Amount in MNEE (wei format)
- `_description` (string): Description of expense
- `_requestType` (RequestType): Type of request (0-3)
- `_vendor` (address): Vendor receiving payment

**Returns:**
- `uint256`: Request ID

**Requirements:**
- Amount must be greater than 0
- Vendor address must not be zero
- Caller must have valid credential

**Example:**
```javascript
const amount = ethers.utils.parseEther("5000"); // 5000 MNEE
const tx = await medTreasury.createRequest(
    amount,
    "Emergency antibiotics supply",
    0, // MEDICAL_SUPPLIES
    vendorAddress
);

const receipt = await tx.wait();
const requestId = receipt.events[0].args.requestId;
console.log("Request created with ID:", requestId.toString());
```

**Events Emitted:**
- `RequestCreated(requestId, requester, amount)`

---

#### `doctorApprove`
Doctor approves a request.

```solidity
function doctorApprove(uint256 _requestId) external onlyAuthorized("DOCTOR")
```

**Parameters:**
- `_requestId` (uint256): ID of request to approve

**Requirements:**
- Caller must have DOCTOR credential
- Request must be in PENDING status

**Example:**
```javascript
await medTreasury.connect(doctorSigner).doctorApprove(1);
```

**Events Emitted:**
- `RequestApproved(requestId, "DOCTOR")`

---

#### `nurseVerify`
Nurse verifies a request.

```solidity
function nurseVerify(uint256 _requestId) external onlyAuthorized("NURSE")
```

**Parameters:**
- `_requestId` (uint256): ID of request to verify

**Requirements:**
- Caller must have NURSE credential
- Request must be in PENDING status

**Example:**
```javascript
await medTreasury.connect(nurseSigner).nurseVerify(1);
```

**Events Emitted:**
- `RequestApproved(requestId, "NURSE")`

---

#### `financeApprove`
Finance team approves a request.

```solidity
function financeApprove(uint256 _requestId) external onlyAuthorized("FINANCE")
```

**Parameters:**
- `_requestId` (uint256): ID of request to approve

**Requirements:**
- Caller must have FINANCE credential
- Request must be in PENDING status
- When all 3 approvals complete, status updates to APPROVED

**Example:**
```javascript
await medTreasury.connect(financeSigner).financeApprove(1);
```

**Events Emitted:**
- `RequestApproved(requestId, "FINANCE")`

---

#### `releaseFunds`
Releases funds to vendor (admin only).

```solidity
function releaseFunds(uint256 _requestId) external onlyAdmin
```

**Parameters:**
- `_requestId` (uint256): ID of request to fund

**Requirements:**
- Caller must be admin
- Request must be APPROVED
- Treasury must have sufficient balance

**Example:**
```javascript
await medTreasury.releaseFunds(1);
console.log("Funds released to vendor");
```

**Events Emitted:**
- `FundsReleased(requestId, vendor, amount)`

---

#### `fundTreasury`
Adds funds to the treasury.

```solidity
function fundTreasury(uint256 _amount) external
```

**Parameters:**
- `_amount` (uint256): Amount to add (must have prior approval)

**Requirements:**
- Caller must have approved treasury to spend tokens
- Amount must be greater than 0

**Example:**
```javascript
// First approve
await mneeToken.approve(medTreasury.address, ethers.utils.parseEther("10000"));

// Then fund
await medTreasury.fundTreasury(ethers.utils.parseEther("10000"));
```

**Events Emitted:**
- `TreasuryFunded(funder, amount)`

---

#### `getRequest`
Retrieves request details.

```solidity
function getRequest(uint256 _requestId) external view returns (ExpenseRequest memory)
```

**Returns:**
- `ExpenseRequest`: Complete request struct

**Example:**
```javascript
const request = await medTreasury.getRequest(1);
console.log("Amount:", ethers.utils.formatEther(request.amount), "MNEE");
console.log("Status:", ["Pending", "Approved", "Rejected", "Completed"][request.status]);
console.log("Doctor approved:", request.doctorApproved);
console.log("Nurse verified:", request.nurseVerified);
console.log("Finance approved:", request.financeApproved);
```

---

#### `getApprovalStatus`
Gets approval status for a request.

```solidity
function getApprovalStatus(uint256 _requestId) external view returns (
    bool doctor,
    bool nurse,
    bool finance
)
```

**Returns:**
- Three booleans indicating approval status

**Example:**
```javascript
const [doctor, nurse, finance] = await medTreasury.getApprovalStatus(1);
console.log(`Approvals: Doctor=${doctor}, Nurse=${nurse}, Finance=${finance}`);
```

---

## MNEEToken Contract

### Overview
ERC20-compliant stablecoin for healthcare payments.

### Standard ERC20 Functions

#### `transfer`
```solidity
function transfer(address _to, uint256 _value) public returns (bool)
```

#### `approve`
```solidity
function approve(address _spender, uint256 _value) public returns (bool)
```

#### `transferFrom`
```solidity
function transferFrom(address _from, address _to, uint256 _value) public returns (bool)
```

#### `balanceOf`
```solidity
function balanceOf(address _owner) public view returns (uint256)
```

#### `allowance`
```solidity
function allowance(address _owner, address _spender) public view returns (uint256)
```

**Example Usage:**
```javascript
// Check balance
const balance = await mneeToken.balanceOf(userAddress);
console.log("Balance:", ethers.utils.formatEther(balance), "MNEE");

// Approve spending
await mneeToken.approve(spenderAddress, ethers.utils.parseEther("1000"));

// Transfer tokens
await mneeToken.transfer(recipientAddress, ethers.utils.parseEther("500"));
```

---

## Events Reference

### ZKHealthIdentity Events

#### CredentialIssued
```solidity
event CredentialIssued(
    address indexed holder,
    string role,
    bytes32 proofHash
)
```

#### CredentialRevoked
```solidity
event CredentialRevoked(
    address indexed holder,
    string role
)
```

#### IssuerAdded
```solidity
event IssuerAdded(address indexed issuer)
```

### MedTreasuryFlow Events

#### RequestCreated
```solidity
event RequestCreated(
    uint256 indexed requestId,
    address requester,
    uint256 amount
)
```

#### RequestApproved
```solidity
event RequestApproved(
    uint256 indexed requestId,
    string role
)
```

#### FundsReleased
```solidity
event FundsReleased(
    uint256 indexed requestId,
    address vendor,
    uint256 amount
)
```

#### TreasuryFunded
```solidity
event TreasuryFunded(
    address funder,
    uint256 amount
)
```

### Event Listening Examples

```javascript
// Listen for new requests
medTreasury.on("RequestCreated", (requestId, requester, amount) => {
    console.log(`New request #${requestId} for ${ethers.utils.formatEther(amount)} MNEE`);
});

// Listen for approvals
medTreasury.on("RequestApproved", (requestId, role) => {
    console.log(`Request #${requestId} approved by ${role}`);
});

// Listen for fund releases
medTreasury.on("FundsReleased", (requestId, vendor, amount) => {
    console.log(`Funds released: ${ethers.utils.formatEther(amount)} MNEE to ${vendor}`);
});
```

---

## Error Codes

### Common Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `"Only admin"` | Non-admin trying admin function | Use admin account |
| `"Not authorized"` | Missing required credential | Issue/verify credential |
| `"Amount must be positive"` | Zero or negative amount | Use positive amount |
| `"Invalid vendor"` | Zero address for vendor | Provide valid vendor address |
| `"Invalid status"` | Request not in correct state | Check request status |
| `"Not approved"` | Trying to release unapproved request | Complete all approvals |
| `"Insufficient balance"` | Treasury lacks funds | Fund treasury first |
| `"Not an issuer"` | Non-issuer trying to issue credential | Use issuer account |
| `"Allowance exceeded"` | Insufficient token approval | Increase approval amount |

---

## Code Examples

### Complete Workflow Example

```javascript
const { ethers } = require("ethers");

async function completeWorkflow() {
    // Setup
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const [deployer, doctor, nurse, finance, vendor] = await provider.listAccounts();
    
    // Contract instances
    const zkIdentity = new ethers.Contract(ZK_ADDRESS, ZK_ABI, provider);
    const medTreasury = new ethers.Contract(TREASURY_ADDRESS, TREASURY_ABI, provider);
    const mneeToken = new ethers.Contract(MNEE_ADDRESS, MNEE_ABI, provider);
    
    // 1. Issue credentials
    console.log("Issuing credentials...");
    const proofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("proof"));
    const oneYear = 365 * 24 * 60 * 60;
    
    await zkIdentity.connect(deployer).issueCredential(doctor, "DOCTOR", proofHash, oneYear);
    await zkIdentity.connect(deployer).issueCredential(nurse, "NURSE", proofHash, oneYear);
    await zkIdentity.connect(deployer).issueCredential(finance, "FINANCE", proofHash, oneYear);
    
    // 2. Fund treasury
    console.log("Funding treasury...");
    const fundAmount = ethers.utils.parseEther("100000");
    await mneeToken.connect(deployer).approve(medTreasury.address, fundAmount);
    await medTreasury.connect(deployer).fundTreasury(fundAmount);
    
    // 3. Create request
    console.log("Creating request...");
    const requestAmount = ethers.utils.parseEther("5000");
    const tx = await medTreasury.connect(doctor).createRequest(
        requestAmount,
        "Medical supplies",
        0,
        vendor
    );
    const receipt = await tx.wait();
    const requestId = 1;
    
    // 4. Approvals
    console.log("Getting approvals...");
    await medTreasury.connect(doctor).doctorApprove(requestId);
    await medTreasury.connect(nurse).nurseVerify(requestId);
    await medTreasury.connect(finance).financeApprove(requestId);
    
    // 5. Release funds
    console.log("Releasing funds...");
    await medTreasury.connect(deployer).releaseFunds(requestId);
    
    // 6. Verify
    const vendorBalance = await mneeToken.balanceOf(vendor);
    console.log("Vendor received:", ethers.utils.formatEther(vendorBalance), "MNEE");
}

completeWorkflow().catch(console.error);
```

### React Frontend Integration

```javascript
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

function MedTreasuryApp() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contracts, setContracts] = useState({});
    
    useEffect(() => {
        async function init() {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                
                setProvider(provider);
                setSigner(signer);
                
                // Initialize contracts
                const medTreasury = new ethers.Contract(
                    TREASURY_ADDRESS,
                    TREASURY_ABI,
                    signer
                );
                
                setContracts({ medTreasury });
            }
        }
        init();
    }, []);
    
    async function createRequest(amount, description, type, vendor) {
        try {
            const tx = await contracts.medTreasury.createRequest(
                ethers.utils.parseEther(amount),
                description,
                type,
                vendor
            );
            await tx.wait();
            alert("Request created successfully!");
        } catch (error) {
            console.error(error);
            alert("Error creating request");
        }
    }
    
    // ... rest of component
}
```

---

## Rate Limits & Best Practices

### Gas Optimization
- Batch credential issuance when possible
- Use `view` functions for reads (no gas cost)
- Minimize on-chain string storage

### Security Best Practices
- Always verify caller credentials before sensitive operations
- Use `onlyAuthorized` modifier consistently
- Implement request validation before approval
- Monitor for unusual approval patterns

### Performance Tips
- Cache credential status off-chain
- Use event listeners for real-time updates
- Implement pagination for request lists
- Use The Graph for complex queries

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**API Status**: Stable