import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Contract, ContractFactory } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as chai from "chai";
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
import { keccak256 } from "ethers/lib/utils";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { token } from "../typechain-types/@openzeppelin/contracts";


describe("Hero contract", () => {
    // const TOTAL_SUPPLY = 100;
    // const TOKEN_URI = "https://example.com/token/";

    let nftContract: Contract;
    let nftMarketContract: Contract;
    let tokenContract: Contract;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let owner: SignerWithAddress;

    async function deployNftFixture() {
        // await ethers.provider.send("hardhat_reset", []);
        [owner, addr1, addr2] = await ethers.getSigners();

        const tokenFactory: ContractFactory = await ethers.getContractFactory("Token");
        tokenContract = await tokenFactory.deploy();
        await tokenContract.deployed();

        const nftFactory: ContractFactory = await ethers.getContractFactory("NFT");
        nftContract = await nftFactory.deploy();
        await nftContract.deployed();

        const nftMarketFactory: ContractFactory = await ethers.getContractFactory("NFTMarketplace");
        nftMarketContract = await nftMarketFactory.deploy(nftContract.address, tokenContract.address);
        await nftMarketContract.deployed();


        return { nftContract, tokenContract, nftMarketContract, owner, addr1, addr2 };
    }

    describe('Deployment', () => {
        it('should set the right owner', async () => {
            const { nftContract } = await loadFixture(deployNftFixture);

            // await nftContract.mint(addr1.address);
            expect(await nftContract.name()).to.equal("Fox Token");
            expect(await nftContract.symbol()).to.equal("FT");
        });

        it('should set the right owner', async () => {
            const { nftContract, addr1 } = await loadFixture(deployNftFixture);

            await nftContract.mint(addr1.address);
            expect(await nftContract.connect(addr1).tokenURI(0)).to.equal("https://famousfoxes.com/hd/0.png");
        });
    });

    describe('List NFT', () => {
        it('should list Nft', async () => {
            const { nftContract, nftMarketContract, addr1 } = await loadFixture(deployNftFixture);

            await nftContract.mint(addr1.address);
            expect(await nftContract.balanceOf(addr1.address)).to.equal(1);

            await nftContract.connect(addr1).approve(nftMarketContract.address, 0);
            await nftMarketContract.connect(addr1).listNft(0, ethers.utils.parseEther("1"));

            expect(await nftContract.ownerOf(0)).to.equal(nftMarketContract.address);
        });

        it('should get all Nfts', async () => {
            const { nftContract, nftMarketContract, addr1 } = await loadFixture(deployNftFixture);

            await nftContract.mint(addr1.address); // 0
            await nftContract.mint(addr1.address); // 1
            await nftContract.mint(addr1.address); // 2

            await nftContract.connect(addr1).approve(nftMarketContract.address, 0);
            await nftMarketContract.connect(addr1).listNft(0, ethers.utils.parseEther("1"));

            await nftContract.connect(addr1).approve(nftMarketContract.address, 2);
            await nftMarketContract.connect(addr1).listNft(2, ethers.utils.parseEther("3"));

            console.log(await nftMarketContract.getAllNfts());
        });

        it('should delist Nft', async () => {
            const { nftContract, nftMarketContract, addr1 } = await loadFixture(deployNftFixture);

            await nftContract.mint(addr1.address);
            expect(await nftContract.balanceOf(addr1.address)).to.equal(1);

            await nftContract.connect(addr1).approve(nftMarketContract.address, 0);
            await nftMarketContract.connect(addr1).listNft(0, ethers.utils.parseEther("1"));

            await nftMarketContract.connect(addr1).delistNft(0);

            expect(await nftContract.ownerOf(0)).to.equal(addr1.address);
        });

        it('should update Nft price', async () => {
            const { nftContract, nftMarketContract, addr1 } = await loadFixture(deployNftFixture);

            await nftContract
                .mint(addr1.address);
            expect(await nftContract.balanceOf(addr1.address)).to.equal(1);

            await nftContract
                .connect(addr1)
                .approve(nftMarketContract.address, 0);
            await nftMarketContract
                .connect(addr1)
                .listNft(0, 1);

            await nftMarketContract.connect(addr1).updateNftPrice(0, 2);

            expect(Number(await nftMarketContract.getPriceOf(0))).to.equal(2);
        });

        it('should buy nft', async () => {
            const { nftContract, tokenContract, nftMarketContract, addr1, addr2 } = await loadFixture(deployNftFixture);

            await nftContract.mint(addr1.address);
            expect(await nftContract.balanceOf(addr1.address)).to.equal(1);

            await nftContract
                .connect(addr1)
                .approve(nftMarketContract.address, 0);
            await nftMarketContract
                .connect(addr1).listNft(0, 2);

            await tokenContract.mint(addr2.address, 20);
            expect(await tokenContract.balanceOf(addr2.address)).to.equal(20);

            await tokenContract.connect(addr2).approve(nftMarketContract.address, 2);
            await nftMarketContract.connect(addr2).buyNft(0, 2);

            expect(await nftContract.ownerOf(0)).to.equal(addr2.address);
            expect(await tokenContract.balanceOf(addr1.address)).to.equal(2);
        });
    });
});