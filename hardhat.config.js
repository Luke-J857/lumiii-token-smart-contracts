require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.6.6",
  defaultNetwork: "OKC",
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-rpc.com",
        // url: "https://exchainrpc.okex.org",
        blockNumber: 14390000,
      },
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
      // url: "https://polygon-mumbai.infura.io/v3/1b7a0517442f4c098135f08255c4e9c1", // testnet polygon
      url: "https://polygon-rpc.com",
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      // gas: "auto",
      // gasPrice: "auto",
    },
    kovan: {
      url: "https://kovan.infura.io/v3/1b7a0517442f4c098135f08255c4e9c1",
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    },
    OKC: {
      url: "https://exchainrpc.okex.org",
      accounts: [process.env.NODE_METAMASK_PRIVATE_KEY],
      // gas: "auto",
      // gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: "NUA2B6EHEDD1TK275CSQR6IUI4JJR277SV",
    customChains: [
      {
        network: "OKC",
        chainId: 66,
        urls: {
          apiURL: "https://api-goerli.etherscan.io/api",
          browserURL: "https://goerli.etherscan.io"
        }
      }
    ]
  },
};
