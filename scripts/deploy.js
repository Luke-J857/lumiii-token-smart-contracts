// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const charityWallet = "0x2040Cf404725D9D3d015163e25b2f1CC413CF295";
  const opsWallet = "0xFf128A8eB6AE0463ed680243513432436662CC99";
  const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  
  const Lumiii  = await hre.ethers.getContractFactory("LumiiiToken"); 
  const lumiii = await Lumiii.deploy(charityWallet, opsWallet, routerAddress);
  
  await lumiii.deployed(); 

  console.log("Token address: ", lumiii.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
