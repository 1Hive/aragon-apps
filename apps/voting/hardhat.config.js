require("dotenv").config();

require("@1hive/hardhat-aragon");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-web3");
require("hardhat-deploy");
require("hardhat-deploy-tenderly");
require("hardhat-gas-reporter");
require("solidity-coverage");

const { node_url, accounts } = require("./utils/network");

process.removeAllListeners("warning");
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
  aragon: {
    appEnsName: "voting.aragonpm.eth",
    appContractName: "Voting",
    appRoles: [
      {
        name: "Create new votes",
        id: "CREATE_VOTES_ROLE",
        params: [],
      },
      {
        name: "Modify support",
        id: "MODIFY_SUPPORT_ROLE",
        params: ["New support", "Current support"],
      },
      {
        name: "Modify quorum",
        id: "MODIFY_QUORUM_ROLE",
        params: ["New quorum", "Current quorum"],
      },
    ],
    appBuildOutputPath: "app/build/",
  },
  networks: {
    hardhat: {
      // process.env.HARDHAT_FORK will specify the network that the fork is made from.
      // this line ensure the use of the corresponding accounts
      accounts: accounts(process.env.HARDHAT_FORK),
      forking: process.env.HARDHAT_FORK
        ? {
          url: node_url(process.env.HARDHAT_FORK),
          blockNumber: process.env.HARDHAT_FORK_NUMBER
            ? parseInt(process.env.HARDHAT_FORK_NUMBER)
            : undefined,
        }
        : undefined,
    },
    localhost: {
      url: node_url("localhost"),
      accounts: accounts(),
      ensRegistry: "0x4E065c622d584Fbe5D9078C3081840155FA69581",
    },
    mainnet: {
      url: node_url("mainnet"),
      accounts: accounts("mainnet"),
    },
    goerli: {
      url: node_url("goerli"),
      accounts: accounts("goerli"),
      ensRegistry: "0x8cF5A255ED61F403837F040B8D9f052857469273",
    },
    ropsten: {
      url: node_url("ropsten"),
      accounts: accounts("ropsten"),
      ensRegistry: "0x6afe2cacee211ea9179992f89dc61ff25c61e923",
    },
    xdai: {
      url: node_url("xdai"),
      accounts: accounts("xdai"),
      ensRegistry: "0xaafca6b0c89521752e559650206d7c925fd0e530",
    },
    polygon: {
      url: node_url("polygon"),
      accounts: accounts("polygon"),
      ensRegistry: "0x4E065c622d584Fbe5D9078C3081840155FA69581",
    },
    mumbai: {
      url: node_url("mumbai"),
      accounts: accounts("mumbai"),
      ensRegistry: "0xB1576a9bE5EC445368740161174f3Dd1034fF8be",
    },
    arbtest: {
      url: node_url("arbtest"),
      accounts: accounts("arbtest"),
      ensRegistry: "0x73ddD4B38982aB515daCf43289B41706f9A39199",
    },
    optimism: {
      url: node_url("optimism"),
      accounts: accounts("optimism"),
      ensRegistry: "0x6f2CA655f58d5fb94A08460aC19A552EB19909FD",
    },
    frame: {
      url: 'http://127.0.0.1:1248',
      httpHeaders: { origin: "hardhat" },
      timeout: 0,
      gas: 0,
    },
  },
  ipfs: {
    url: "http://127.0.0.1:5001/",
    gateway: "https://ipfs.blossom.software/",
    pinata: {
      key: process.env.PINATA_KEY || "",
      secret: process.env.PINATA_SECRET_KEY || "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
  mocha: {
    timeout: 0,
  },
  external: process.env.HARDHAT_FORK
    ? {
      deployments: {
        // process.env.HARDHAT_FORK will specify the network that the fork is made from.
        // these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
        hardhat: ["deployments/" + process.env.HARDHAT_FORK],
        localhost: ["deployments/" + process.env.HARDHAT_FORK],
      },
    }
    : undefined,
};
