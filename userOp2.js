"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
const ethers_1 = require("ethers");
const userop_1 = require("userop");
dotenv.config();
const signingKey = process.env.SIGNING_KEY || '';
const rpcUrl = process.env.RPC_URL || '';
const paymasterUrl = process.env.PAYMASTER_URL || '';
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ethersProvider = ethers_1.ethers.getDefaultProvider(rpcUrl);
            const wallet = new ethers_1.ethers.Wallet(signingKey, ethersProvider);
            const TOKEN_ADDRESS = '0x06365A63B7b8270f9B629f2FeE0c7ceaE591d86F';
            const destination = wallet.address;
            const amount = ethers_1.ethers.utils.parseUnits(JSON.stringify(100), 6);
            const ERC20_ABI = require("./abi/abi.json");
            const tokenContract = new ethers_1.ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, ethersProvider);
            // Encode the transfer function
            const transferData = tokenContract.interface.encodeFunctionData('transfer', [destination, amount]);
            // Initialize the paymaster
            const paymasterContext = {
                type: 'payg',
            };
            const paymaster = userop_1.Presets.Middleware.verifyingPaymaster(paymasterUrl, paymasterContext);
            // Initialize userop builder
            const builder = yield userop_1.Presets.Builder.Kernel.init(wallet, rpcUrl, {
                paymasterMiddleware: paymaster,
            });
            const calls = [
                {
                    to: TOKEN_ADDRESS,
                    value: ethers_1.ethers.constants.Zero,
                    data: transferData,
                },
            ];
            // Build & send
            const client = yield userop_1.Client.init(rpcUrl);
            const res = yield client.sendUserOperation(builder.executeBatch(calls), {
                onBuild: (op) => console.log('Signed UserOperation:', op),
            });
            console.log(`UserOpHash: ${res.userOpHash}`);
            console.log('Waiting for transaction...');
            const ev = yield res.wait();
            console.log(`Transaction hash: ${(_a = ev === null || ev === void 0 ? void 0 : ev.transactionHash) !== null && _a !== void 0 ? _a : null}`);
            return ev === null || ev === void 0 ? void 0 : ev.transactionHash;
        }
        catch (error) {
            console.error('Error in sendTokenUsingUserOp:', error);
            return null;
        }
    });
}
main();
