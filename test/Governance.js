// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// const { expect } = require("chai");
// const { ethers, assert } = require("hardhat");
// const { v2RouterAbi, v2RouterAddress, v2FactoryAbi, ERC20Abi, advanceBlock } = require("./utils");


// describe("Governance tests", () => {

//   beforeEach(async () => {
//     users = await hre.ethers.getSigners();
//     let owner = users[0]
//     let charityWallet = users[4].address;
//     let opsWallet = users[5].address;

//     router = new hre.ethers.Contract(v2RouterAddress, v2RouterAbi, owner);
//     factory = new hre.ethers.Contract(router.factory(), v2FactoryAbi, owner);
//     weth = await router.WETH();
    
//     const LumiiiContract  = await hre.ethers.getContractFactory("LumiiiToken");      
//     Lumiii = await LumiiiContract.deploy(charityWallet, opsWallet, v2RouterAddress, {gasLimit: 3e7});
//   });

//   it("Delegate votes", async function() {
//     // Call delegate function
//     const delegatee = users[3].address;
//     const res = await Lumiii.connect(users[1]).delegate(delegatee);
//   });

//   it("Get delegatees for an address", async function() {
//     const delegator = users[1].address;
//     await Lumiii.connect(users[1]).delegate(users[3].address);
//     const res = await Lumiii.delegates(delegator);
    
//     expect(res).to.be.equal(users[3].address)
//   });
//   // Must have token balance to vote
//   it("Get current votes", async function() {
//     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("112"));

//     // delegate vote
//     const delegator = users[1].address;
//     await Lumiii.connect(users[1]).delegate(users[3].address);

//     const res = await Lumiii.getCurrentVotes(users[3].address);

//     expect(ethers.utils.formatEther(res)).to.be.equal("112.0");
//   });

//   it("Get prior votes", async function() {
//     let blockNumbers = new Array(3)
//     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("112"));

//     // Number of checkpoitns will be 0 before, 1 after
//     const delegator = users[1].address;
//     await Lumiii.connect(users[1]).delegate(users[3].address);
//     const delegate = await Lumiii.delegates(delegator);
//     blockNumbers[0] = await ethers.provider.getBlockNumber();
    

//     advanceBlock(100);
//     blockNumbers[1] = await ethers.provider.getBlockNumber();

//     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("113"));
//     await Lumiii.connect(users[2]).delegate(users[3].address);

//     const res = await Lumiii.getPriorVotes(users[3].address, blockNumbers[0]);
//     const res1 = await Lumiii.getCurrentVotes(users[3].address);

//     expect(ethers.utils.formatEther(res)).to.be.equal("112.0");
//     expect(ethers.utils.formatEther(res1)).to.be.equal("225.0");

//   });

//   it("Get prior votes for invalid block", async function() {
//     let blockNumbers = new Array(3)
//     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));

//     // Get votes before any delegation, should be 0
//     const res = await Lumiii.getPriorVotes(users[3].address, 0);

//     const delegator = users[1].address;
//     await Lumiii.connect(users[1]).delegate(users[3].address);
//     blockNumbers[0] = await ethers.provider.getBlockNumber();

//     // Block number will be less than the block of 0 transaction
//     // There would be no votes at this time, thus should return 0
//     const res1 = await Lumiii.getPriorVotes(users[3].address, blockNumbers[0]-1);

//     expect(res).to.be.equal(0);
//     expect(res1).to.be.equal(0);
//   });

//   it("Move delegates after transfer", async function() {
//     // Fund user accounts
//     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("100"));
//     await Lumiii.transfer(users[2].address, ethers.utils.parseEther("50"));

//     await Lumiii.connect(users[1]).delegate(users[3].address);
//     await Lumiii.connect(users[2]).delegate(users[4].address);

//     // Get votes before transfer
//     const votes = await Lumiii.getCurrentVotes(users[3].address);
//     const votes1 = await Lumiii.getCurrentVotes(users[4].address);

//     // Transfer from user1 to user2
//     await Lumiii.connect(users[1]).transfer(users[2].address, ethers.utils.parseEther("30"));

//     const newvotes = await Lumiii.getCurrentVotes(users[3].address);
//     const newvotes1 = await Lumiii.getCurrentVotes(users[4].address);

//     expect(ethers.utils.formatEther(votes)).to.be.equal("100.0");
//     expect(ethers.utils.formatEther(votes1)).to.be.equal("50.0");

//     expect(ethers.utils.formatEther(newvotes)).to.be.equal("70.0");
//     expect(ethers.utils.formatEther(newvotes1)).to.be.equal("80.0");
//   });

//   it("Switch delegate to new account", async function() {
//     await Lumiii.transfer(users[1].address, ethers.utils.parseEther("30"));

//     await Lumiii.connect(users[1]).delegate(users[3].address); 
//     await Lumiii.connect(users[1]).delegate(users[4].address);

//     const votes = await Lumiii.getCurrentVotes(users[3].address);
//     const votes1 = await Lumiii.getCurrentVotes(users[4].address);

//     // Should not be able to delegate votes, old delegate should move to new one
//     expect(ethers.utils.formatEther(votes)).to.be.equal("0.0");
//     expect(ethers.utils.formatEther(votes1)).to.be.equal("30.0")
//   });
// });