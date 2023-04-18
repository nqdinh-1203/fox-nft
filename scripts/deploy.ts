import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from address: ", deployer.address);

  // const Token = await ethers.getContractFactory("Token");
  // const token = await Token.deploy();
  // console.log("Token address: ", token.address);
  // Config.setConfig(network + '.Token', token.address);

  // const Nft = await ethers.getContractFactory("NFT");
  // const nft = await Nft.deploy();
  // console.log("Nft address: ", nft.address);
  // Config.setConfig(network + '.Nft', nft.address);

  const MKP = await ethers.getContractFactory("NFTMarketplace");
  const mkp = await MKP.deploy("0x1C4997bA80af8F9fE9383Ff5Fe92066CCd254a96", "0x9B29b8a58E166Cc13d3ea8A7617f1D70528D6460");
  console.log("Marketplace address: ", await mkp.address);
  Config.setConfig(network + '.NFTMarketplace', await mkp.address);

  await Config.updateConfig();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
