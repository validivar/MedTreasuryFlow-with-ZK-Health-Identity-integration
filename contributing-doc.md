# Contributing to MedTreasuryFlow

First off, thank you for considering contributing to MedTreasuryFlow! It's people like you that make this project such a great tool for improving healthcare finance globally.

## 🎯 Vision

MedTreasuryFlow aims to revolutionize healthcare treasury management through privacy-preserving technology. We're building a system that's:
- **Private**: Using zero-knowledge proofs to protect sensitive data
- **Transparent**: Maintaining complete audit trails on-chain
- **Efficient**: Automating approval workflows
- **Global**: Accessible to clinics, hospitals, and NGOs worldwide

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what you expected**
* **Include screenshots if relevant**
* **Note your environment** (OS, Node version, etc.)

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS 13.0]
 - Node Version: [e.g. 16.15.0]
 - Hardhat Version: [e.g. 2.12.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List some examples of how it would be used**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

* **good-first-issue** - Issues that should only require a few lines of code
* **help-wanted** - Issues that are a bit more involved

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes** (`npm test`)
5. **Make sure your code lints** (`npm run lint`)
6. **Write a good commit message**
7. **Submit a pull request**

**Pull Request Template:**
```markdown
**Description**
Clear description of what this PR does.

**Type of change**
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

**How Has This Been Tested?**
Describe the tests you ran and how to reproduce.

**Checklist:**
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 💻 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/medtreasury-flow.git
cd medtreasury-flow

# Add upstream remote
git remote add upstream https://github.com/original/medtreasury-flow.git

# Install dependencies
npm install

# Create a branch for your feature
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Run tests
npm test

# Commit your changes
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📝 Coding Standards

### Solidity Style Guide

Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title ContractName
 * @dev Brief description
 */
contract ContractName {
    // State variables
    uint256 public value;
    
    // Events
    event ValueChanged(uint256 newValue);
    
    // Modifiers
    modifier onlyPositive(uint256 _value) {
        require(_value > 0, "Value must be positive");
        _;
    }
    
    // Functions
    /**
     * @dev Function description
     * @param _newValue The new value to set
     */
    function setValue(uint256 _newValue) external onlyPositive(_newValue) {
        value = _newValue;
        emit ValueChanged(_newValue);
    }
}
```

### JavaScript/TypeScript Style Guide

* Use 4 spaces for indentation
* Use camelCase for variables and functions
* Use PascalCase for classes and components
* Add JSDoc comments for functions
* Keep functions small and focused

```javascript
/**
 * Creates a new medical expense request
 * @param {number} amount - The amount in MNEE
 * @param {string} description - Description of the expense
 * @param {number} type - Request type enum value
 * @returns {Promise<number>} The request ID
 */
async function createRequest(amount, description, type) {
    // Implementation
}
```

### Testing Standards

* Write tests for all new features
* Maintain test coverage above 80%
* Use descriptive test names
* Group related tests using `describe` blocks

```javascript
describe("MedTreasuryFlow", function () {
    describe("Request Creation", function () {
        it("Should create a request with valid parameters", async function () {
            // Test implementation
        });
        
        it("Should reject requests with zero amount", async function () {
            // Test implementation
        });
    });
});
```

## 🏗️ Project Structure

```
medtreasury-flow/
├── contracts/          # Smart contracts
│   ├── MedTreasuryFlow.sol
│   ├── ZKHealthIdentity.sol
│   └── interfaces/
├── scripts/           # Deployment scripts
├── test/              # Test files
├── frontend/          # Web interface
└── docs/              # Documentation
```

## 🔍 Code Review Process

1. **Automated checks** must pass (tests, linting)
2. **At least one approval** from a maintainer
3. **No merge conflicts** with main branch
4. **Documentation** updated if needed
5. **Tests added** for new features

## 🐛 Issue Labels

* **bug** - Something isn't working
* **enhancement** - New feature or request
* **good-first-issue** - Good for newcomers
* **help-wanted** - Extra attention needed
* **documentation** - Documentation improvements
* **security** - Security-related issues
* **performance** - Performance improvements

## 🔐 Security

If you discover a security vulnerability, please **DO NOT** open an issue. Email team@medtreasury.com instead.

## 📜 Commit Message Guidelines

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters
* Reference issues and pull requests

**Good commit messages:**
```
Add ZK proof verification to approval workflow

- Implement proof hash validation
- Add tests for proof verification
- Update documentation

Closes #123
```

## 🌟 Recognition

Contributors will be recognized in:
* README.md contributors section
* Release notes
* Project documentation

## 📞 Communication

* **GitHub Issues**: For bugs and feature requests
* **GitHub Discussions**: For questions and general discussion
* **Twitter**: [@medtreasury](https://twitter.com/medtreasury) for updates
* **Email**: team@medtreasury.com for private matters

## 📚 Additional Resources

* [Solidity Documentation](https://docs.soliditylang.org/)
* [Hardhat Documentation](https://hardhat.org/docs)
* [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
* [Zero-Knowledge Proofs Introduction](https://z.cash/technology/zksnarks/)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MedTreasuryFlow! Together, we're building the future of healthcare finance. 🚀💙