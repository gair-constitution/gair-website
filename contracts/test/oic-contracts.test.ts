// OIC Smart Contracts Test Suite
// Hardhat configuration and tests for OIC core contracts

import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer, BigNumber } from "ethers";

describe("OICToken", function () {
  let token: any;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory("OICToken");
    token = await Token.deploy();
    await token.deployed();
  });

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      expect(await token.name()).to.equal("Open Intelligence Compact");
      expect(await token.symbol()).to.equal("OIC");
    });

    it("Should assign total supply to owner", async function () {
      const ownerBalance = await token.balanceOf(await owner.getAddress());
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have max supply of 100M", async function () {
      const MAX_SUPPLY = ethers.utils.parseEther("100000000");
      expect(await token.totalSupply()).to.be.lte(MAX_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      // Transfer from owner to addr1
      await token.transfer(await addr1.getAddress(), amount);
      expect(await token.balanceOf(await addr1.getAddress())).to.equal(amount);
      
      // Transfer from addr1 to addr2
      await token.connect(addr1).transfer(await addr2.getAddress(), amount);
      expect(await token.balanceOf(await addr2.getAddress())).to.equal(amount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(await owner.getAddress());
      
      await expect(
        token.connect(addr1).transfer(await owner.getAddress(), 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      
      expect(await token.balanceOf(await owner.getAddress())).to.equal(initialOwnerBalance);
    });
  });

  describe("Delegation", function () {
    it("Should delegate voting power", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await token.transfer(await addr1.getAddress(), amount);
      
      const delegateTx = await token.connect(addr1).delegate(await addr2.getAddress());
      await delegateTx.wait();
      
      const votes = await token.getVotes(await addr2.getAddress());
      expect(votes).to.equal(amount);
    });

    it("Should correctly count checkpoints", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await token.transfer(await addr1.getAddress(), amount);
      
      // Delegate
      await token.connect(addr1).delegate(await addr1.getAddress());
      
      // Transfer to addr2 (should reduce votes)
      await token.connect(addr1).transfer(await addr2.getAddress(), amount);
      
      const votes = await token.getVotes(await addr1.getAddress());
      expect(votes).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const amount = ethers.utils.parseEther("10000");
      const initialSupply = await token.totalSupply();
      
      await token.mint(await addr1.getAddress(), amount);
      
      expect(await token.balanceOf(await addr1.getAddress())).to.equal(amount);
      expect(await token.totalSupply()).to.equal(initialSupply.add(amount));
    });

    it("Should not allow non-owner to mint", async function () {
      const amount = ethers.utils.parseEther("10000");
      
      await expect(
        token.connect(addr1).mint(await addr1.getAddress(), amount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not exceed max supply", async function () {
      const MAX_SUPPLY = ethers.utils.parseEther("100000000");
      const currentSupply = await token.totalSupply();
      const excess = MAX_SUPPLY.sub(currentSupply).add(ethers.utils.parseEther("1"));
      
      await expect(
        token.mint(await addr1.getAddress(), excess)
      ).to.be.revertedWith("Cap exceeded");
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn tokens", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await token.transfer(await addr1.getAddress(), amount);
      
      const initialSupply = await token.totalSupply();
      const initialBalance = await token.balanceOf(await addr1.getAddress());
      
      await token.connect(addr1).burn(amount);
      
      expect(await token.balanceOf(await addr1.getAddress())).to.equal(initialBalance.sub(amount));
      expect(await token.totalSupply()).to.equal(initialSupply.sub(amount));
    });
  });
});

describe("OICStaking", function () {
  let staking: any;
  let token: any;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let treasury: Signer;

  const MIN_STAKE = ethers.utils.parseEther("1000");
  const UNSTAKE_DELAY = 30 * 24 * 60 * 60; // 30 days

  beforeEach(async function () {
    [owner, addr1, addr2, treasury] = await ethers.getSigners();
    
    // Deploy token
    const Token = await ethers.getContractFactory("OICToken");
    token = await Token.deploy();
    await token.deployed();
    
    // Deploy staking
    const Staking = await ethers.getContractFactory("OICStaking");
    staking = await Staking.deploy(token.address, await treasury.getAddress());
    await staking.deployed();
    
    // Fund addr1 with tokens
    await token.transfer(await addr1.getAddress(), ethers.utils.parseEther("10000"));
    await token.transfer(await addr2.getAddress(), ethers.utils.parseEther("500"));
    
    // Approve staking contract
    await token.connect(addr1).approve(staking.address, ethers.utils.parseEther("10000"));
    await token.connect(addr2).approve(staking.address, ethers.utils.parseEther("500"));
  });

  describe("Deployment", function () {
    it("Should set correct minimum stake", async function () {
      expect(await staking.MIN_STAKE()).to.equal(MIN_STAKE);
    });

    it("Should set correct unstake delay", async function () {
      expect(await staking.UNSTAKE_DELAY()).to.equal(UNSTAKE_DELAY);
    });
  });

  describe("Staking", function () {
    it("Should allow staking above minimum", async function () {
      const amount = ethers.utils.parseEther("5000");
      
      await staking.connect(addr1).stake(amount);
      
      expect(await staking.getStake(await addr1.getAddress())).to.equal(amount);
    });

    it("Should not allow staking below minimum", async function () {
      const amount = ethers.utils.parseEther("100");
      
      await expect(
        staking.connect(addr1).stake(amount)
      ).to.be.revertedWith("Below minimum");
    });

    it("Should emit Staked event", async function () {
      const amount = ethers.utils.parseEther("2000");
      
      await expect(staking.connect(addr1).stake(amount))
        .to.emit(staking, "Staked")
        .withArgs(await addr1.getAddress(), amount);
    });

    it("Should handle multiple stakes", async function () {
      const amount1 = ethers.utils.parseEther("2000");
      const amount2 = ethers.utils.parseEther("3000");
      
      await staking.connect(addr1).stake(amount1);
      await staking.connect(addr1).stake(amount2);
      
      expect(await staking.getStake(await addr1.getAddress())).to.equal(amount1.add(amount2));
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      await staking.connect(addr1).stake(ethers.utils.parseEther("5000"));
    });

    it("Should start unstaking process", async function () {
      const amount = ethers.utils.parseEther("2000");
      
      await staking.connect(addr1).requestUnstake(amount);
      
      const stake = await staking.getStake(await addr1.getAddress());
      expect(stake).to.equal(ethers.utils.parseEther("3000"));
    });

    it("Should not allow unstaking more than staked", async function () {
      const amount = ethers.utils.parseEther("10000");
      
      await expect(
        staking.connect(addr1).requestUnstake(amount)
      ).to.be.revertedWith("Insufficient stake");
    });

    it("Should complete unstaking after delay", async function () {
      const amount = ethers.utils.parseEther("2000");
      const initialBalance = await token.balanceOf(await addr1.getAddress());
      
      // Request unstaking
      await staking.connect(addr1).requestUnstake(amount);
      
      // Move time forward (in tests, we use hardhat_setNextBlockTimestamp)
      const now = await ethers.provider.getBlock("latest").then((b: any) => b.timestamp);
      await ethers.provider.send("evm_setNextBlockTimestamp", [now + UNSTAKE_DELAY + 1]);
      
      // Complete unstaking
      await staking.connect(addr1).completeUnstake(amount);
      
      expect(await token.balanceOf(await addr1.getAddress())).to.be.above(initialBalance);
    });

    it("Should not complete unstaking before delay", async function () {
      const amount = ethers.utils.parseEther("2000");
      
      await staking.connect(addr1).requestUnstake(amount);
      
      await expect(
        staking.connect(addr1).completeUnstake(amount)
      ).to.be.revertedWith("Cooldown not complete");
    });
  });

  describe("Slashing", function () {
    beforeEach(async function () {
      await staking.connect(addr1).stake(ethers.utils.parseEther("5000"));
    });

    it("Should allow owner to slash", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await staking.slash(await addr1.getAddress(), amount, "Test slash");
      
      expect(await staking.isSlashed(await addr1.getAddress())).to.be.true;
    });

    it("Should record slashed amount", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await staking.slash(await addr1.getAddress(), amount, "Test slash");
      
      expect(await staking.slashedHistory(await addr1.getAddress())).to.equal(amount);
    });

    it("Should not allow non-owner to slash", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await expect(
        staking.connect(addr1).slash(await addr1.getAddress(), amount, "Test")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});

describe("OICAdherenceRegistry", function () {
  let registry: any;
  let staking: any;
  let token: any;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let treasury: Signer;

  const MIN_STAKE = ethers.utils.parseEther("1000");

  beforeEach(async function () {
    [owner, addr1, addr2, treasury] = await ethers.getSigners();
    
    // Deploy token
    const Token = await ethers.getContractFactory("OICToken");
    token = await Token.deploy();
    await token.deployed();
    
    // Deploy staking
    const Staking = await ethers.getContractFactory("OICStaking");
    staking = await Staking.deploy(token.address, await treasury.getAddress());
    await staking.deployed();
    
    // Deploy registry
    const Registry = await ethers.getContractFactory("OICAdherenceRegistry");
    registry = await Registry.deploy(staking.address, await treasury.getAddress());
    await registry.deployed();
    
    // Fund and stake for addr1
    await token.transfer(await addr1.getAddress(), ethers.utils.parseEther("10000"));
    await token.connect(addr1).approve(staking.address, ethers.utils.parseEther("10000"));
    await staking.connect(addr1).stake(ethers.utils.parseEther("5000"));
    
    // Fund and stake for addr2
    await token.transfer(await addr2.getAddress(), ethers.utils.parseEther("500"));
    await token.connect(addr2).approve(staking.address, ethers.utils.parseEther("500"));
  });

  describe("Registration", function () {
    it("Should allow registration with sufficient stake", async function () {
      const uri = "ipfs://QmExample";
      
      await expect(
        registry.connect(addr1).register(uri, "0x00", "0x00")
      ).to.emit(registry, "AdherentRegistered");
      
      const [status, stake, , metadata] = await registry.getStatus(await addr1.getAddress());
      expect(status).to.equal(1); // VOLUNTARY enum
      expect(stake).to.equal(ethers.utils.parseEther("5000"));
    });

    it("Should not allow registration with insufficient stake", async function () {
      const uri = "ipfs://QmExample";
      
      await expect(
        registry.connect(addr2).register(uri, "0x00", "0x00")
      ).to.be.revertedWith("Insufficient stake");
    });

    it("Should not allow duplicate registration", async function () {
      const uri = "ipfs://QmExample";
      
      await registry.connect(addr1).register(uri, "0x00", "0x00");
      
      await expect(
        registry.connect(addr1).register(uri, "0x00", "0x00")
      ).to.be.revertedWith("Already registered");
    });

    it("Should not allow registration if slashed", async function () {
      const uri = "ipfs://QmExample";
      
      // Slash addr1
      await staking.slash(await addr1.getAddress(), ethers.utils.parseEther("1000"), "Test");
      
      await expect(
        registry.connect(addr1).register(uri, "0x00", "0x00")
      ).to.be.revertedWith("Cannot register: slashed");
    });
  });

  describe("Status Checking", function () {
    beforeEach(async function () {
      await registry.connect(addr1).register("ipfs://QmExample", "0x00", "0x00");
    });

    it("Should return correct status for adherent", async function () {
      const [status, stake, , metadata] = await registry.getStatus(await addr1.getAddress());
      expect(status).to.equal(1); // VOLUNTARY
    });

    it("Should return NONE for non-adherent", async function () {
      const [status, , ,] = await registry.getStatus(await addr2.getAddress());
      expect(status).to.equal(0); // NONE
    });

    it("Should correctly report good standing", async function () {
      const isStanding = await registry.isInGoodStanding(await addr1.getAddress());
      expect(isStanding).to.be.true;
    });
  });

  describe("Metadata", function () {
    beforeEach(async function () {
      await registry.connect(addr1).register("ipfs://QmExample1", "0x00", "0x00");
    });

    it("Should allow updating metadata", async function () {
      const newUri = "ipfs://QmExample2";
      
      await registry.connect(addr1).updateMetadata(newUri);
      
      const [,,, metadata] = await registry.getStatus(await addr1.getAddress());
      expect(metadata).to.equal(newUri);
    });
  });

  describe("Slashing via Registry", function () {
    beforeEach(async function () {
      await registry.connect(addr1).register("ipfs://QmExample", "0x00", "0x00");
    });

    it("Should allow owner to slash adherent", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await registry.slash(await addr1.getAddress(), amount, "Test reason");
      
      expect(await staking.isSlashed(await addr1.getAddress())).to.be.true;
    });

    it("Should not allow slashing non-adherent", async function () {
      const amount = ethers.utils.parseEther("1000");
      
      await expect(
        registry.slash(await addr2.getAddress(), amount, "Test")
      ).to.be.revertedWith("Must be registered");
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      await registry.connect(addr1).register("ipfs://QmExample", "0x00", "0x00");
    });

    it("Should allow withdrawal after cooldown", async function () {
      const now = await ethers.provider.getBlock("latest").then((b: any) => b.timestamp);
      // 180 days cooldown
      await ethers.provider.send("evm_setNextBlockTimestamp", [now + 180 * 24 * 60 * 60 + 1]);
      
      await registry.connect(addr1).withdraw();
      
      const [status, , ,] = await registry.getStatus(await addr1.getAddress());
      expect(status).to.equal(4); // EXPIRED
    });
  });
});

// Helper function to advance time
export async function advanceTime(seconds: number) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}
