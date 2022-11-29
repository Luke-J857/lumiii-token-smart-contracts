// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const charityWallet = "0x4B6fF9Ddd2dAD1033Ee6f07639e151FAF801e5E9";
  const opsWallet = "0x9528bd68B9Aefc95ddaddeB492b17801a11D8364";
  // const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // uniswap router
  // const routerAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // quickswap router
  const routerAddress = "0xc97b81B8a38b9146010Df85f1Ac714aFE1554343"; // okc router
  
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
