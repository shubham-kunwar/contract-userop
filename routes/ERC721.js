"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeERC721Routes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Erc721_1 = require("../services/Erc721");
const SignUserOpViaAuth_1 = require("../services/SignUserOpViaAuth");
function initializeERC721Routes(app, ERC721Contract, ERC721Address) {
    // Handle POST requests to add a position
    app.post("/transferNft", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { receiverAddress, tokenID, password } = req.body;
            console.log(req.body);
            // Extract the authorization token from the request headers
            const bearerToken = req.headers.authorization;
            if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            // Extract the JWT token (remove 'Bearer ' from the token string)
            const token = bearerToken.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const ownerAddress = decoded.smartWalletAddress;
            const getUserOp = yield (0, Erc721_1.approveAndSignNFToken)(ERC721Contract, ERC721Address, ownerAddress, receiverAddress, tokenID);
            // Relay the transaction via smart wallet
            try {
                // Sign User Operation and wait for the result
                const signUserOp = yield (0, SignUserOpViaAuth_1.SignUserOpViaAuth)(ERC721Contract, getUserOp, password, bearerToken);
                // console.log(signUserOp)
                // Respond to the client
                if (signUserOp.status == 200) {
                    // Respond to the client with success
                    res.status(200).json({
                        message: "Token Approved and sent",
                        details: signUserOp.data,
                    });
                }
                else {
                    // Handle the case where the relayed transaction failed
                    res.status(400).json({ error: signUserOp });
                }
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to Submit user Operation",
                    error: error, // Include the error message for debugging purposes
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error.reason || error.message });
        }
    }));
    app.post("/mint", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            console.log(req.body, password);
            // Extract the authorization token from the request headers
            const bearerToken = req.headers.authorization;
            if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            // Extract the JWT token (remove 'Bearer ' from the token string)
            const token = bearerToken.split(" ")[1];
            // Verify and decode the JWT token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const ownerAddress = decoded.smartWalletAddress;
            const getUserOp = yield (0, Erc721_1.mintNft)(ownerAddress, ERC721Contract, ERC721Address);
            // Relay the transaction via smart wallet
            try {
                // Sign User Operation and wait for the result
                const signUserOp = yield (0, SignUserOpViaAuth_1.SignUserOpViaAuth)(ERC721Contract, getUserOp, password, bearerToken);
                console.log(signUserOp);
                // Respond to the client
                if (signUserOp.status == 200) {
                    // Respond to the client with success
                    res.status(200).json({
                        message: "NFT Claimed Successfully",
                        details: signUserOp.data,
                    });
                }
                else {
                    // Handle the case where the relayed transaction failed
                    res.status(400).json({ error: signUserOp });
                }
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to Submit user Operation",
                    error: error, // Include the error message for debugging purposes
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }));
}
exports.initializeERC721Routes = initializeERC721Routes;
