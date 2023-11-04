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
exports.transfer = exports.approveAndSignToken = void 0;
const ethers_1 = require("ethers");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function approveAndSignToken(ERC20Contract, ERC20Address, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const [symbol, decimals] = yield Promise.all([
            ERC20Contract.symbol(),
            ERC20Contract.decimals(),
        ]);
        const amount = ethers_1.ethers.utils.parseUnits(value, decimals);
        console.log(`Approving ${value} ${symbol}...`);
        const approve = {
            to: ERC20Address,
            value: amount,
            data: ERC20Contract.interface.encodeFunctionData("approve", [ERC20Address, amount]),
        };
        const send = {
            to: ERC20Address,
            value: amount,
            data: ERC20Contract.interface.encodeFunctionData("transfer", [ERC20Address, amount]),
        };
        console.log(approve, send);
        return [approve, send];
    });
}
exports.approveAndSignToken = approveAndSignToken;
function transfer(ERC20Contract, ERC20Address, receiverAddress, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const amount = ethers_1.ethers.utils.parseUnits(value);
        const send = {
            to: ERC20Address,
            value: 0,
            data: ERC20Contract.interface.encodeFunctionData("transfer", [receiverAddress, amount]),
        };
        return [send];
    });
}
exports.transfer = transfer;
