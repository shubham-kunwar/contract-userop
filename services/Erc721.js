"use strict";
//basic server for 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintNft = exports.approveAndSignNFToken = void 0;
const ethers_1 = require("ethers");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function approveAndSignNFToken(ERC721Contract, ERC721Address, ownerAddress, receiverAddress, tokenID) {
    return __awaiter(this, void 0, void 0, function* () {
        const Id = ethers_1.ethers.BigNumber.from(tokenID);
        console.log(Id);
        const approve = {
            to: ERC721Address,
            value: ethers_1.ethers.constants.Zero,
            data: ERC721Contract.interface.encodeFunctionData("safeTransferFrom", [ownerAddress, receiverAddress, Id]),
        };
        // const send = {
        //   to: ERC721Address,
        //   value: ethers.constants.Zero,
        //   data: ERC721Contract.interface.encodeFunctionData("transfer", [receiverAddress, Id]),
        // };
        return [approve];
    });
}
exports.approveAndSignNFToken = approveAndSignNFToken;
function mintNft(ownerAddress, ERC721Contract, ERC721Address) {
    return __awaiter(this, void 0, void 0, function* () {
        const allowlistProof = {
            "proof": [],
            "quantityLimitPerWallet": "1",
            "pricePerToken": "0",
            "currency": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        };
        const mint = {
            to: ERC721Address,
            value: ethers_1.ethers.constants.Zero,
            data: ERC721Contract.interface.encodeFunctionData("claim", [ownerAddress, 1, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", 0, allowlistProof, []]),
        };
        console.log(mint);
        return [mint];
    });
}
exports.mintNft = mintNft;
