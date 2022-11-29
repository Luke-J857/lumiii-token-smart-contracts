const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, assert } = require("hardhat");
const { v2RouterAbi, v2RouterAddress, v2FactoryAbi, ERC20Abi } = require("./utils");

let Lumiii;
let router;
let users;
let owner;
let charityWallet;
let opsWallet;
let weth;

describe("Lumiii contract", function () {

  beforeEach(async () => {
    users = await hre.ethers.getSigners();
    owner = users[0]
    charityWallet = users[4].address;
    opsWallet = users[5].address;
    childChainManager = users[7].address;

    router = new hre.ethers.Contract(v2RouterAddress, v2RouterAbi, owner);
    factory = new hre.ethers.Contract(router.factory(), v2FactoryAbi, owner);
    weth = await router.WETH();
    
    const LumiiiContract  = await hre.ethers.getContractFactory("LumiiiToken");      
    Lumiii = await LumiiiContract.deploy(charityWallet, opsWallet, v2RouterAddress, {gasLimit: 3e7});
  });

  describe("Lumiii functions", function () {
    it("Get token info", async function() {
      const name = await Lumiii.name();
      const symbol = await Lumiii.symbol();
      const decimals = await Lumiii.decimals();

      expect(name).to.be.equal("LumiiiToken");
      expect(symbol).to.be.equal("LUMIII");
      expect(decimals).to.be.equal(18);
    });

    it("Check zero address exclusion", async function() {
      const zeroAddress = await ethers.constants.AddressZero;
      const excluded = await Lumiii.isExcluded(zeroAddress);

      expect(excluded).to.be.equal(true);
    });
  });

  // describe("Lumiii transfers", function () {
  //   it("Deployment", async function () {
  //     const ownerBalance = await Lumiii.balanceOf(owner.address);
      
  //     expect(await Lumiii.totalSupply()).to.equal(ownerBalance);
  //     expect(ownerBalance).to.be.equal(ethers.utils.parseEther("10000000000"));
  //   });

  //   it("Change user allowance", async function() {
  //     await Lumiii.increaseAllowance(users[1].address, ethers.utils.parseEther("10"));
  //     const allowance1 = await Lumiii.allowance(owner.address, users[1].address);

  //     await Lumiii.decreaseAllowance(users[1].address, ethers.utils.parseEther("5"));
  //     const allowance2 = await Lumiii.allowance(owner.address, users[1].address);
      
  //     expect(ethers.utils.formatEther(allowance1)).to.be.equal("10.0");
  //     expect(ethers.utils.formatEther(allowance2)).to.be.equal("5.0");
  //   });
 
  //   it("Transfer to users", async function () {
  //     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     const balance = ethers.utils.formatEther(await Lumiii.balanceOf(users[1].address));
  //     const balance1 = ethers.utils.formatEther(await Lumiii.balanceOf(users[2].address));
      
  //     expect(balance).to.equal("100.0");
  //     expect(balance1).to.equal("120.0");
  //   });
    
  //   it("Check transfer tax", async function () {
  //     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     await Lumiii.approve(users[1].address, ethers.utils.parseEther("100"));


  //     await Lumiii.connect(users[1]).transfer(users[2].address, ethers.utils.parseEther("20"));
  //     const balance = ethers.utils.formatEther(await Lumiii.balanceOf(users[1].address));
  //     const balance1 = ethers.utils.formatEther(await Lumiii.balanceOf(users[2].address));

  //     // Transfer should get taxed 10% 
  //     expect(Number(balance).toFixed(2)).to.equal("80.00");
  //     expect(Number(balance1).toFixed(2)).to.equal("138.00"); 
  //   });

  //   it("Transfer from user", async function() {
  //     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     await Lumiii.connect(users[1]).approve(owner.address, ethers.utils.parseEther("100"));

  //     await Lumiii.transferFrom(users[1].address, users[2].address, ethers.utils.parseEther("100"));

  //     const balance = await Lumiii.balanceOf(users[1].address);
  //     const balance1 = await Lumiii.balanceOf(users[2].address);

  //     expect(ethers.utils.formatEther(balance)).to.be.equal("0.0");
  //     expect(Number(ethers.utils.formatEther(balance1)).toFixed(2)).to.be.equal("210.00"); // Will be taxed 10%
  //   });

  //   it("Check reflection rewards", async function () {
  //     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     const transferAmount = ethers.utils.parseEther("100");

  //     await Lumiii.approve(users[2].address, transferAmount);
      
  //     // Check user balances before transaction
  //     let balance1 = await Lumiii.balanceOf(users[1].address);
  //     let balance3 = await Lumiii.balanceOf(users[3].address);

  //     // Calcualte the reflection reward for user3
  //     const user3Percentage = await Lumiii.balanceOf(users[3].address) / await Lumiii.totalSupply();
  //     const user3Reward = 0.03 * user3Percentage * transferAmount;

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     // Check user balances after transaction
  //     let newbalance1 = ethers.utils.formatEther(await Lumiii.balanceOf(users[1].address));
  //     let newbalance3 = ethers.utils.formatEther(await Lumiii.balanceOf(users[3].address));

  //     let formatBalance3 = ethers.utils.formatEther(balance3.add(user3Reward));

  //     // Check if user3 received reward
  //     expect(Number(newbalance3).toFixed(4)).to.equal(Number(formatBalance3).toFixed(4))
  //   });

  //   it("Change tax fee", async function() {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("100"));
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("100"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     // Approve transfer amount
  //     const transferAmount = ethers.utils.parseEther("100");
  //     await Lumiii.approve(users[2].address, transferAmount);

      
  //     //await Lumiii.connect(owner).setTaxFeePercent(1);
  //     await Lumiii.connect(owner).setFees(1, 3, 1, 3);

  //     // make sure only owner can change
  //     try {
  //       await Lumiii.connect(users[1]).setTaxFeePercent(2, 3, 1, 3);
  //       assert(false);
  //       assert(false);
  //     } catch (error) {
  //       // Should raise error
  //     }

  //     // Make sure tax is capped at 10%
  //     try {
  //       await Lumiii.connect(owner).setTaxFeePercent(5, 3, 1, 3);
  //       assert(false);
  //     } catch (error) {
  //       // Should raise error
  //     }
      
  //     let balance3 = await Lumiii.balanceOf(users[3].address);

  //     // Calcualte the reflection reward for user3
  //     const user3Percentage = await Lumiii.balanceOf(users[3].address) / await Lumiii.totalSupply();
  //     const user3Reward = user3Percentage * transferAmount * 0.01;

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     let newbalance3 = ethers.utils.formatEther(await Lumiii.balanceOf(users[3].address));
  //     let formatBalance3 = ethers.utils.formatEther(balance3.add(user3Reward));
      
  //     // Check if user3 received reward
  //     expect(Number(newbalance3).toFixed(4)).to.equal(Number(formatBalance3).toFixed(4))
  //   });

  //   it("Test reflection compound interest", async function() {
  //     // First transaction
  //     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("200"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     const transferAmount = ethers.utils.parseEther("100");

  //     await Lumiii.approve(users[2].address, transferAmount);
      
  //     // Check user balances before transaction
  //     let balance1 = await Lumiii.balanceOf(users[1].address);
  //     let balance3 = await Lumiii.balanceOf(users[3].address);

  //     // Calcualte the reflection reward for user3
  //     let user3Percentage = await Lumiii.balanceOf(users[3].address) / await Lumiii.totalSupply();
  //     let user3Reward1 = 0.03 * user3Percentage * transferAmount;

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     // Check user balances after transaction
  //     let newbalance1 = ethers.utils.formatEther(await Lumiii.balanceOf(users[1].address));
  //     let newbalance3 = ethers.utils.formatEther(await Lumiii.balanceOf(users[3].address));

  //     let formatBalance3 = ethers.utils.formatEther(balance3.add(user3Reward1));

  //     // Check if user3 received reward
  //     expect(Number(newbalance3).toFixed(4)).to.equal(Number(formatBalance3).toFixed(4))
  //     // Second transaction
  //     await Lumiii.approve(users[2].address, transferAmount);

  //     balance1 = await Lumiii.balanceOf(users[1].address);
  //     balance3 = await Lumiii.balanceOf(users[3].address);

  //     // Calcualte the reflection reward for user3
  //     user3Percentage = await Lumiii.balanceOf(users[3].address) / await Lumiii.totalSupply();
  //     let user3Reward2 = 0.03 * user3Percentage * transferAmount;

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     // Check user balances after transaction
  //     newbalance1 = ethers.utils.formatEther(await Lumiii.balanceOf(users[1].address));
  //     newbalance3 = ethers.utils.formatEther(await Lumiii.balanceOf(users[3].address));
      
  //     // Check that second transaction reward is greater than first transaction reward
  //     // If the two rewards were the same, the interest would be simple rather than compound
  //     expect(user3Reward2).to.be.above(user3Reward1)
      
  //     expect(Number(newbalance3)).to.be.above(Number(ethers.utils.formatEther(balance3)));
      
  //   });

  //   it("Test rewards exclusion", async function () {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     const transferAmount = ethers.utils.parseEther("80");

  //     await Lumiii.approve(users[2].address, transferAmount);
      
  //     // Check user balances before transaction
  //     let balance3 = await Lumiii.balanceOf(users[3].address);

  //     // Exclude user3 from rewards
  //     await Lumiii.connect(owner).excludeFromReward(users[3].address);

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     // Check user balances after transaction
  //     let newbalance3 = ethers.utils.formatEther(await Lumiii.balanceOf(users[3].address));

  //     let formatBalance3 = ethers.utils.formatEther(balance3);

  //     expect(await Lumiii.isExcluded(users[3].address)).to.equal(true);
  //     expect(newbalance3).to.equal(formatBalance3);
  //   });

  //   it("Include rewards for excluded account", async function () {
  //     // Exclude user3 from rewards
  //     await Lumiii.connect(owner).excludeFromReward(users[3].address);

  //     // Fund accounts with token
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     const transferAmount = ethers.utils.parseEther("80");

  //     // Get balance before transfer
  //     let balance3 = await Lumiii.balanceOf(users[3].address);

  //     let user3Percentage = await Lumiii.balanceOf(users[3].address) / await Lumiii.totalSupply();
  //     let user3Reward = 0.03 * user3Percentage * transferAmount;

  //     await Lumiii.approve(users[2].address, transferAmount);

  //     // Include user3 in rewards
  //     await Lumiii.connect(owner).includeInReward(users[3].address);

  //     // Trnasfer to uesr1
  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     // Check user balances after transaction
  //     let newbalance3 = ethers.utils.formatEther(await Lumiii.balanceOf(users[3].address));

  //     let formatBalance3 = ethers.utils.formatEther(balance3.add(user3Reward));

  //     expect(await Lumiii.isExcluded(users[3].address)).to.equal(false);
  //     expect(Number(newbalance3).toFixed(4)).to.equal(Number(formatBalance3).toFixed(4));
  //   });
  // });

  // describe("Lumiii Charity", async function() {
  //   it("Check if charity wallet recieves tax", async function() {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     // Approve transfer amount
  //     const transferAmount = ethers.utils.parseEther("100");
  //     await Lumiii.approve(users[2].address, transferAmount);

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     const charityBalance = await Lumiii.balanceOf(charityWallet);

  //     expect(ethers.utils.formatEther(charityBalance)).to.be.equal("1.0");
  //   });

  //   it("Change charity percentage", async function() {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     // Approve transfer amount
  //     const transferAmount = ethers.utils.parseEther("100");
  //     await Lumiii.approve(users[2].address, transferAmount);
    
  //     // Set liquidity fee to 0 to allow charity fee to be over 1%
  //     await Lumiii.connect(owner).setFees(3, 0, 2, 3);

  //     // make sure only owner can change
  //     try {
  //       await Lumiii.connect(users[1]).setFees(3, 0, 1, 3);
  //       assert(false);
  //     } catch (error) {
  //       // Should raise error
  //     }

  //     // Make sure tax is capped at 10%
  //     try {
  //       await Lumiii.connect(owner).setFees(3, 3, 5, 3);
  //       assert(false);
  //     } catch (error) {
  //       // Should raise error
  //     }
      
  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     const charityBalance = await Lumiii.balanceOf(charityWallet);
      
  //     expect(ethers.utils.formatEther(charityBalance)).to.be.equal("2.0");
  //   });

  //   it("Change charity wallet  address", async function() {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.connect(owner).setCharityWallet(users[1].address);

  //     // New wallet is exlcuded 
  //     const excluded = await Lumiii.connect(owner).isExcluded(users[1].address);
  //     // Old wallet is included
  //     const included = await Lumiii.connect(owner).isExcluded(charityWallet);

  //     try {
  //       await Lumiii.connect(users[1]).setCharityWallet(users[4].address);
  //     } catch (error) {
  //       // Should raise error
  //     }

  //     // Approve transfer amount
  //     const transferAmount = ethers.utils.parseEther("100");
  //     await Lumiii.approve(users[2].address, transferAmount);

  //     await Lumiii.connect(users[2]).transfer(users[3].address, transferAmount);

  //     const charityBalance = await Lumiii.balanceOf(users[1].address);
  //     const user4Balance = await Lumiii.balanceOf(users[4].address);

  //     expect(included).to.be.equal(false);
  //     expect(excluded).to.be.equal(true);

  //     expect(ethers.utils.formatEther(charityBalance)).to.be.equal("1.0");
  //     expect(ethers.utils.formatEther(user4Balance)).to.be.equal("0.0");

  //   });

  //   it("Charity is excluded", async function() {
  //     const excluded = await Lumiii.connect(owner).isExcluded(charityWallet);

  //     expect(excluded).to.be.equal(true);
  //   });
  // });

  // describe("Lumiii Operations", async function() {
  //   it("Check if ops wallet recieves tax", async function() {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     // Approve transfer amount
  //     const transferAmount = ethers.utils.parseEther("100");
  //     await Lumiii.approve(users[2].address, transferAmount);

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     const opsBalance = await Lumiii.balanceOf(opsWallet);
      
  //     expect(ethers.utils.formatEther(opsBalance)).to.be.equal("3.0");
  //   });

  //   it("Change ops percentage", async function() {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.transfer(users[3].address, ethers.utils.parseEther("1000"));

  //     // Approve transfer amount
  //     const transferAmount = ethers.utils.parseEther("100");
  //     await Lumiii.approve(users[2].address, transferAmount);

  //     // Make sure only owner can change percentage
  //     await Lumiii.connect(owner).setFees(3,3,1,2);

  //     try {
  //       await Lumiii.connect(users[1]).setFees(3,3,1,1);
  //       assert(false);
  //     } catch (error) {
  //       // Should raise error
  //     }

  //     // Make sure tax is capped at 10%
  //     try {
  //       await Lumiii.connect(owner).setFees(3,3,1,5);
  //       assert(false);
  //     } catch (error) {
  //       // Should raise error
  //     }

  //     await Lumiii.connect(users[2]).transfer(users[1].address, transferAmount);

  //     const opsBalance = await Lumiii.balanceOf(opsWallet);

  //     expect(ethers.utils.formatEther(opsBalance)).to.be.equal("2.0");
  //   });

  //   it("Change ops wallet address", async function() {
  //     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));
  //     await Lumiii.connect(owner).setOpsWallet(users[1].address);

  //     const excluded = await Lumiii.connect(owner).isExcluded(users[1].address);

  //     // Old wallet is included
  //     const included = await Lumiii.connect(owner).isExcluded(opsWallet);
      
  //     try {
  //       await Lumiii.connect(users[1]).setOpsWallet(users[6].address);
  //       assert(false);
  //     } catch (error) {
  //       // Should raise error
  //     }

  //     // Approve transfer amount
  //     const transferAmount = ethers.utils.parseEther("100");
  //     await Lumiii.approve(users[2].address, transferAmount);

  //     await Lumiii.connect(users[2]).transfer(users[3].address, transferAmount);

  //     const opsBalance = await Lumiii.balanceOf(users[1].address);
  //     const user4Balance = await Lumiii.balanceOf(users[6].address);

  //     expect(included).to.be.equal(false);
  //     expect(excluded).to.be.equal(true);

  //     expect(ethers.utils.formatEther(opsBalance)).to.be.equal("3.0");
  //     expect(ethers.utils.formatEther(user4Balance)).to.be.equal("0.0");
  //   });

  //   it("Ops is excluded", async function() {
  //     const excluded = await Lumiii.connect(owner).isExcluded(opsWallet);

  //     expect(excluded).to.be.equal(true);
  //   });
  // });

  describe("Lumiii liquiduty", async function() {
    it("Contract recieves liquidity", async function() {
      await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
      await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));

      // Get contract balance, contract holds liquidity
      const balance = await Lumiii.balanceOf(Lumiii.address);

      const transferAmount = ethers.utils.parseEther("100");
      await Lumiii.approve(users[1].address, transferAmount);
      await Lumiii.connect(users[1]).transfer(users[2].address, transferAmount);

      const newbalance = await Lumiii.balanceOf(Lumiii.address);

      // Contract balance should increase after transfer
      // Liquidity pool should recieve 3% (3 Lumiii)
      expect(Number(newbalance)).to.be.above(Number(balance));
      expect(Number(ethers.utils.formatEther(newbalance)).toFixed(4)).to.be.equal("3.0000");
      
    });

    it("Change liquidity percentage", async function() {
      await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
      await Lumiii.transfer(users[2].address, ethers.utils.parseEther("120"));

      // Get contract balance, contract holds liquidity
      const balance = await Lumiii.balanceOf(Lumiii.address);

      await Lumiii.connect(owner).setFees(3,1,1,3);

      // Make sure tax is capped at 10%
      try {
        await Lumiii.connect(owner).setFees(3,5,1,3);
        assert(false);
      } catch (error) {
        // Should raise error
      }

      const transferAmount = ethers.utils.parseEther("100");
      await Lumiii.approve(users[1].address, transferAmount);
      await Lumiii.connect(users[1]).transfer(users[2].address, transferAmount);

      const newbalance = await Lumiii.balanceOf(Lumiii.address);

      expect(Number(newbalance)).to.be.above(Number(balance));
      expect(Number(ethers.utils.formatEther(newbalance)).toFixed(4)).to.be.equal("1.0000");
    });

    it("LP token balance increases", async function() {
      const deadline = Math.floor(Date.now() / 1000) + 20*60;
      const value = ethers.utils.parseEther("100");

      await Lumiii.connect(owner).approve(v2RouterAddress, ethers.utils.parseEther("5000000"));

      const liquidity = await router.addLiquidityETH(Lumiii.address, ethers.utils.parseEther("5000000"), 0, 0, v2RouterAddress, deadline,
        {value: value, gasPrice: 30e9, gasLimit: 3e7});

      // Get lp token address
      const pair = await factory.getPair(Lumiii.address, weth);

      const lpToken = new hre.ethers.Contract(pair, ERC20Abi, owner);
      const balance = await lpToken.balanceOf(owner.address);

      // swap
      // const exclude = await Lumiii.excludeFromReward(pair);
      await Lumiii.connect(users[1]).approve(v2RouterAddress, ethers.utils.parseEther("5000000"));
      await Lumiii.transfer(users[1].address, ethers.utils.parseEther("10000"));
      const swap = await router.connect(users[1]).swapExactTokensForETHSupportingFeeOnTransferTokens(ethers.utils.parseEther("1000"), 0, [Lumiii.address, weth], "0x2040Cf404725D9D3d015163e25b2f1CC413CF295", deadline);
        
      // Transfer so that liquidity threshold is reached
      await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
      await Lumiii.transfer(Lumiii.address, ethers.utils.parseEther("5000000"));

      const transferAmount = ethers.utils.parseEther("100");
      await Lumiii.approve(users[1].address, transferAmount);
      await Lumiii.connect(users[1]).transfer(users[2].address, transferAmount);
      
      const newbalance = await lpToken.balanceOf(owner.address);
      
      // Check if lp token balance increased
      expect(newbalance).to.be.above(balance);
    });
  });
});
