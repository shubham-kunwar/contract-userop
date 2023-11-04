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
exports.initializeRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Erc20_1 = require("../services/Erc20");
const SignUserOpViaAuth_1 = require("../services/SignUserOpViaAuth");
function initializeRoutes(app, ERC20Contract, ERC20Address) {
    // Handle POST requests to add a position
    app.post("/sendErc20Token", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { receiverAddress, value, password } = req.body;
            console.log(req.body);
            // Extract the authorization token from the request headers
            const bearerToken = req.headers.authorization;
            if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Bearer token not" });
            }
            // Extract the JWT token (remove 'Bearer ' from the token string)
            const token = bearerToken.split(" ")[1];
            // Verify and decode the JWT token
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                // The token is valid, proceed with your logic
            }
            catch (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({ error: "Unauthorized" });
            }
            const getUserOp = yield (0, Erc20_1.transfer)(ERC20Contract, ERC20Address, receiverAddress, value);
            console.log(getUserOp);
            // Relay the transaction via smart wallet
            try {
                // Sign User Operation and wait for the result
                const signUserOp = yield (0, SignUserOpViaAuth_1.SignUserOpViaAuth)(ERC20Contract, getUserOp, password, bearerToken);
                console.log(signUserOp);
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
            res.status(500).json({ error: error });
        }
    }));
}
exports.initializeRoutes = initializeRoutes;
