import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config()

const ALCHEMY_API_KEY = "GMGOq5IweL2FmHvrCa2v_H8ISKknDtUu";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
    polygon_mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
  },

  etherscan: {
    apiKey: {
      goerli: `${process.env.API_KEY_ETHERSCAN}`,
      polygonMumbai: `${process.env.API_KEY_POLYGONSCAN}`,
    }
  }
};

export default config;