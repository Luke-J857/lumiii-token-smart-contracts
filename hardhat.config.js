require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("hardhat-contract-sizer");
require('dotenv').config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  
  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.6.6",
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-rpc.com",
        blockNumber: 14390000
      }
    },
    ropsten: {
      url: process.env.NODE_INFURA_PROVIDER,
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      gas: "auto",
    },
    rinkeby: {
      url: process.env.NODE_INFURA_RINKEBY_PROVIDER,
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      gas: "auto",
    },
    goerli: {
      url: "https://goerli.infura.io/v3/1b7a0517442f4c098135f08255c4e9c1",
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    },
    polygon: {
      url: "https://polygon-mumbai.infura.io/v3/1b7a0517442f4c098135f08255c4e9c1",
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    },
    kovan: {
      url: "https://kovan.infura.io/v3/1b7a0517442f4c098135f08255c4e9c1",
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    }
  }
};
