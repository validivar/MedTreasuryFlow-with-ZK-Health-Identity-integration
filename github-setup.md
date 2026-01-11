# 🚀 MedTreasuryFlow - Complete Setup & Deployment Guide

## 📁 Repository Structure

```
medtreasury-flow/
├── 📄 README.md                    # Main documentation
├── 📄 LICENSE                      # MIT License
├── 📄 .gitignore                   # Git ignore patterns
├── 📄 package.json                 # Dependencies
├── 📄 hardhat.config.js            # Hardhat configuration
│
├── 📂 contracts/                   # Smart contracts
│   ├── MedTreasuryFlow.sol        # Main treasury contract
│   ├── ZKHealthIdentity.sol       # ZK credential system
│   ├── MNEEToken.sol              # Token implementation
│   └── interfaces/                # Contract interfaces
│
├── 📂 scripts/                    # Deployment scripts
│   ├── deploy-complete.js         # Full deployment
│   ├── deploy-testnet.js          # Testnet deployment
│   └── simulate-workflow.js       # Demo workflow
│
├── 📂 test/                       # Test suite
│   ├── MedTreasuryFlow.test.js   # Main tests
│   ├── ZKHealthIdentity.test.js  # Identity tests
│   └── integration.test.js        # Integration tests
│
├── 📂 frontend/                   # Web interface
│   ├── index.html                 # Main demo page
│   ├── app.js                     # Application logic
│   ├── styles.css                 # Custom styles
│   └── assets/                    # Images, icons
│
├── 📂 docs/                       # Documentation
│   ├── ARCHITECTURE.md            # System architecture
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── CONTRIBUTING.md            # Contribution guide
│
└── 📂 .github/                    # GitHub specific
    ├── workflows/                 # CI/CD pipelines
    │   └── test.yml              # Automated testing
    └── ISSUE_TEMPLATE/           # Issue templates
```

---

## 🎯 Quick Start (5 Minutes)

### Prerequisites
- Node.js v16+ and npm
- Git
- A code editor (VS Code recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/medtreasury-flow.git
cd medtreasury-flow

# 2. Install dependencies
npm install

# 3. Compile contracts
npx hardhat compile

# 4. Run tests
npx hardhat test

# 5. Start local blockchain
npx hardhat node

# 6. Deploy (in new terminal)
npx hardhat run scripts/deploy-complete.js --network localhost

# 7. Open the demo
cd frontend
open index.html  # or just double-click the file
```

**That's it! You're running MedTreasuryFlow locally.** 🎉

---

## 📦 Detailed Installation Guide

### Step 1: Environment Setup

#### Install Node.js
```bash
# Check if Node.js is installed
node --version  # Should be v16 or higher

# If not installed, download from:
# https://nodejs.org/
```

#### Install Git
```bash
# Check if Git is installed
git --version

# If not installed:
# macOS: Install Xcode Command Line Tools
# Windows: Download from https://git-scm.com/
# Linux: sudo apt-get install git
```

### Step 2: Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/medtreasury-flow.git
cd medtreasury-flow

# Install all dependencies
npm install

# This installs:
# - Hardhat (Ethereum development environment)
# - OpenZeppelin contracts (security standards)
# - Testing libraries (Chai, Mocha)
# - And other development tools
```

### Step 3: Verify Installation

```bash
# Compile smart contracts
npx hardhat compile

# You should see:
# ✓ Compiled 3 Solidity files successfully

# Run the test suite
npx hardhat test

# You should see:
# ✓ 25+ tests passing
```

---

## 🧪 Running Tests

### Run All Tests
```bash
npx hardhat test
```

### Run Specific Test File
```bash
npx hardhat test test/MedTreasuryFlow.test.js
```

### Run Tests with Gas Report
```bash
REPORT_GAS=true npx hardhat test
```

### Run Tests with Coverage
```bash
npm install --save-dev solidity-coverage
npx hardhat coverage
```

### Expected Test Output
```
  MedTreasuryFlow + ZK Health Identity
    ZK Health Identity
      ✓ Should issue credentials correctly
      ✓ Should verify ZK proofs
      ✓ Should revoke credentials
      ✓ Should detect expired credentials
      ✓ Should only allow issuers to create credentials
    
    Treasury Management
      ✓ Should fund treasury correctly
      ✓ Should create expense requests
      ✓ Should reject requests without credentials
    
    Approval Workflow
      ✓ Should allow doctor approval with ZK proof
      ✓ Should allow nurse verification with ZK proof
      ✓ Should allow finance approval with ZK proof
      ✓ Should reject approvals without credentials
      ✓ Should update status after all approvals
    
    Fund Release
      ✓ Should release funds after all approvals
      ✓ Should update treasury balance after release
      ✓ Should update request status to COMPLETED
      ✓ Should not release without all approvals
      ✓ Should not release with insufficient balance
    
    Events
      ✓ Should emit RequestCreated event
      ✓ Should emit RequestApproved event
      ✓ Should emit CredentialIssued event
    
    Edge Cases
      ✓ Should handle multiple requests sequentially
      ✓ Should handle zero-amount requests
      ✓ Should prevent double approvals
    
    Security
      ✓ Should only allow admin to release funds
      ✓ Should only allow admin to add issuers
      ✓ Should validate vendor address

  25 passing (3s)
```

---

## 🌐 Local Deployment

### Step 1: Start Local Blockchain

```bash
# Terminal 1: Start Hardhat Network
npx hardhat node

# You'll see:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# 
# Accounts:
# Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
# Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
# ... (more accounts)
```

### Step 2: Deploy Contracts

```bash
# Terminal 2: Deploy
npx hardhat run scripts/deploy-complete.js --network localhost

# You'll see:
# 🚀 Deploying MedTreasuryFlow with ZK Health Identity...
# Deploying with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
#
# 📝 Deploying MNEE Token...
# ✅ MNEE Token deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
#
# 📝 Deploying ZK Health Identity...
# ✅ ZK Health Identity deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
#
# 📝 Deploying MedTreasuryFlow...
# ✅ MedTreasuryFlow deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
#
# 💰 Funding treasury...
# ✅ Treasury funded with 100,000 MNEE
#
# 🔐 Issuing demo ZK credentials...
# ✅ Issued DOCTOR credential
# ✅ Issued NURSE credential
# ✅ Issued FINANCE credential
#
# 🎉 Deployment complete!
#
# 📋 Contract Addresses:
# MNEE Token: 0x5FbDB2315678afecb367f032d93F642f64180aa3
# ZK Health Identity: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
# MedTreasuryFlow: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
#
# 💾 Deployment info saved to deployment-info.json
```

### Step 3: Open Frontend Demo

```bash
# Navigate to frontend folder
cd frontend

# Open in browser
# macOS:
open index.html

# Windows:
start index.html

# Linux:
xdg-open index.html

# Or just double-click index.html in your file explorer
```

---

## 🌍 Testnet Deployment

### Supported Networks
- Polygon Mumbai (Testnet)
- Sepolia (Ethereum Testnet)
- Goerli (Ethereum Testnet)
- BNB Testnet

### Configuration

1. **Create `.env` file**:
```bash
# In project root
touch .env
```

2. **Add your keys**:
```env
PRIVATE_KEY=your_wallet_private_key_here
INFURA_API_KEY=your_infura_key_here
ETHERSCAN_API_KEY=your_etherscan_key_here
```

3. **Update `hardhat.config.js`**:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

4. **Deploy to testnet**:
```bash
# Deploy to Polygon Mumbai
npx hardhat run scripts/deploy-complete.js --network mumbai

# Deploy to Sepolia
npx hardhat run scripts/deploy-complete.js --network sepolia
```

5. **Verify contracts**:
```bash
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'hardhat'"

**Solution**:
```bash
npm install --save-dev hardhat
```

### Issue: "Error HH8: There's one or more errors in your config file"

**Solution**:
```bash
# Check hardhat.config.js syntax
# Make sure all required plugins are installed
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

### Issue: "Transaction reverted without a reason"

**Solution**:
```bash
# Add more detail to error messages
npx hardhat test --verbose

# Or check specific function
npx hardhat console
> const contract = await ethers.getContractAt("MedTreasuryFlow", "ADDRESS")
> await contract.functionName(...args)
```

### Issue: "Insufficient funds"

**Solution**:
```bash
# For local network: restart Hardhat node
# For testnet: get test tokens from faucet
# Polygon Mumbai: https://faucet.polygon.technology/
# Sepolia: https://sepoliafaucet.com/
```

### Issue: Frontend not connecting to contracts

**Solution**:
1. Check that Hardhat node is running
2. Verify contract addresses in deployment-info.json
3. Update frontend/app.js with correct addresses
4. Clear browser cache
5. Check browser console for errors

---

## 📝 Creating GitHub Repository

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `medtreasury-flow`
3. Description: "Privacy-Preserving Healthcare Treasury with ZK Identity | MNEE Hackathon 2025"
4. Set to Public
5. Don't initialize with README (we have one)
6. Click "Create repository"

### Step 2: Push Local Code

```bash
# In your project directory

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MedTreasuryFlow with ZK Health Identity"

# Add remote
git remote add origin https://github.com/yourusername/medtreasury-flow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Configure Repository

#### Add Topics/Tags
In GitHub repository settings, add topics:
- `healthcare`
- `blockchain`
- `zero-knowledge-proofs`
- `mnee`
- `smart-contracts`
- `solidity`
- `web3`
- `treasury-management`

#### Create .gitignore

```bash
# .gitignore content
node_modules/
.env
cache/
artifacts/
coverage/
coverage.json
typechain-types/
.DS_Store
*.log
deployment-info.json
```

#### Add GitHub Actions (Optional)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Compile contracts
      run: npx hardhat compile
    
    - name: Run tests
      run: npx hardhat test
```

---

## 🎥 Recording Demo Video

### Option 1: Using OBS Studio (Free, Professional)

1. **Download OBS**: https://obsproject.com/
2. **Setup**:
   - Resolution: 1920x1080
   - FPS: 30
   - Source: Display Capture or Window Capture
3. **Record**:
   - Practice workflow 3 times
   - Start recording
   - Go through each step slowly
   - Stop recording
4. **Edit** in DaVinci Resolve (free) or iMovie

### Option 2: Using Loom (Quick & Easy)

1. **Install**: https://www.loom.com/
2. **Select**: Screen + Camera or Screen only
3. **Record**: Narrate as you demonstrate
4. **Share**: Get instant link

### Option 3: Using Zoom (If you have it)

1. Start Zoom meeting
2. Share screen
3. Record locally
4. Edit recording
5. Export video

### Demo Script Quick Reference

1. **Show landing page** (5 sec)
2. **Issue ZK credentials** - all three roles (20 sec)
3. **Create request** - fill form and submit (15 sec)
4. **Approve workflow** - doctor, nurse, finance (30 sec)
5. **Release funds** - show payment complete (10 sec)
6. **Show stats update** (5 sec)
7. **Highlight features** - privacy, speed, transparency (15 sec)

Total: ~90 seconds core demo

---

## 📤 Submitting to Devpost

### Step 1: Create Devpost Account
- Go to https://devpost.com/
- Sign up or log in

### Step 2: Find MNEE Hackathon
- Navigate to https://mnee-eth.devpost.com/
- Click "Submit Project"

### Step 3: Fill Submission Form

**Basic Information**:
- Project name: MedTreasuryFlow + ZK Health Identity
- Tagline: Privacy-Preserving Healthcare Treasury Management
- Website: https://github.com/yourusername/medtreasury-flow

**Description**: Copy from DEVPOST_SUBMISSION.md

**Video**: Upload to YouTube, paste link

**Links**:
- GitHub: Your repository URL
- Demo: GitHub Pages or local recording
- Documentation: Link to docs folder

**Built With**:
- Solidity
- Hardhat
- MNEE
- Zero-Knowledge Proofs
- JavaScript
- Web3

**Team**:
- Add team members if applicable

### Step 4: Upload Images

1. **Cover Image** (2560x1440 recommended)
2. **Screenshots** (4-6 images):
   - Dashboard view
   - ZK credential issuance
   - Request creation
   - Approval workflow
   - Fund release
   - Stats/analytics

### Step 5: Final Checklist

- [ ] All required fields filled
- [ ] Video uploaded and working
- [ ] GitHub repo is public
- [ ] README is comprehensive
- [ ] Demo is functional
- [ ] Screenshots are clear
- [ ] Team members added
- [ ] Submission reviewed
- [ ] Submitted before deadline

---

## 🏆 Judging Criteria Alignment

| Criteria | Our Implementation | Evidence |
|----------|-------------------|----------|
| **Technological Sophistication** | ZK proofs, multi-sig, smart contracts | Code in contracts/ folder |
| **User Experience** | One-click approvals, beautiful UI | frontend/index.html demo |
| **Impact Potential** | Solves real healthcare problems | Use cases in docs/ |
| **Originality** | First ZK + treasury for healthcare | Unique architecture |
| **Completion** | Full working system | Passing tests, live demo |

---

## 📚 Additional Resources

### Learning Materials
- **Solidity**: https://docs.soliditylang.org/
- **Hardhat**: https://hardhat.org/docs
- **Zero-Knowledge Proofs**: https://z.cash/technology/zksnarks/
- **MNEE Documentation**: [Provided by hackathon]

### Community
- **Discord**: Join MNEE Hackathon server
- **Twitter**: Share progress with #MNEEHackathon
- **GitHub Discussions**: Ask questions in repo

### Tools
- **Remix IDE**: https://remix.ethereum.org/ (online Solidity IDE)
- **Etherscan**: Verify deployed contracts
- **OpenZeppelin**: https://www.openzeppelin.com/ (security standards)

---

## ❓ FAQ

**Q: Do I need real ZK-SNARK implementation for the hackathon?**
A: No! The simulated version demonstrates the concept. The architecture is ready for real ZK proofs.

**Q: Can I deploy to mainnet?**
A: Yes, but use testnet for hackathon. Mainnet deployment requires real MNEE tokens and gas fees.

**Q: How do I add my team to the GitHub repo?**
A: Settings → Collaborators → Add people

**Q: Can I modify the code?**
A: Absolutely! This is open source (MIT License). Fork, modify, improve!

**Q: Where do I get test MNEE tokens?**
A: The deployment script creates them for local testing. For testnet, check hackathon resources.

**Q: My tests are failing, what do I do?**
A: Run `npx hardhat clean` then `npx hardhat compile` then `npx hardhat test --verbose`

**Q: Can I use this for my clinic/organization?**
A: Yes! But integrate real ZK proofs and do a security audit first.

---

## 📞 Support

**Issues**: https://github.com/yourusername/medtreasury-flow/issues
**Email**: team@medtreasury.com
**Twitter**: @medtreasury

---

## 📄 License

MIT License - see LICENSE file

---

**Built with ❤️ for MNEE Hackathon 2025**

*"Transforming healthcare finance through privacy, transparency, and automation."*

🚀 **Ready to revolutionize healthcare finance? Let's go!** 🚀