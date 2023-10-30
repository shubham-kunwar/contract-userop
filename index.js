"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ethers_1 = require("ethers");
const cors_1 = __importDefault(require("cors"));
const abi_json_1 = __importDefault(require("./abi/abi.json"));
const ERC721abi_json_1 = __importDefault(require("./abi/ERC721abi.json"));
const ERC20_1 = require("./routes/ERC20");
const ERC721_1 = require("./routes/ERC721");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = Number(process.env.PORT) || 8002;
const rpcUrl = process.env.RPC_URL || "";
const ERC20Address = process.env.ERC20Address || "";
const ERC721Address = process.env.ERC721Address || "";
const provider = new ethers_1.ethers.providers.JsonRpcProvider(rpcUrl);
const ERC20Contract = new ethers_1.ethers.Contract(ERC20Address, abi_json_1.default, provider);
const ERC721Contract = new ethers_1.ethers.Contract(ERC721Address, ERC721abi_json_1.default, provider);
// Initialize routes for ERC20
(0, ERC20_1.initializeRoutes)(app, ERC20Contract, ERC20Address);
(0, ERC721_1.initializeERC721Routes)(app, ERC721Contract, ERC721Address);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
