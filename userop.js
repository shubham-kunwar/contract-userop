
const {config} = require("dotenv");

const {ethers} = require("ethers");
const { Presets, Client } = require("userop");


config();
const signingKey = process.env.SIGNING_KEY || "";
const rpcUrl = process.env.RPC_URL || "";
const paymasterUrl = process.env.PAYMASTER_URL || "";
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

async function approveAndSendToken( to, token, value) {
  const ERC20_ABI = require("./abi/abi.json");
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const decimals = await Promise.all([erc20.decimals()]);
  const amount = ethers.utils.parseUnits(value, decimals);

  const approve = {
    to: token,
    value: ethers.constants.Zero,
    data: erc20.interface.encodeFunctionData("approve", [to, amount]),
  };

  const send = {
    to: token,
    value: ethers.constants.Zero,
    data: erc20.interface.encodeFunctionData("transfer", [to, amount]),
  };

  return [approve, send];
}

async function main() {
  // Paymaster
  const paymasterContext = {type: "payg"};
  const paymaster = Presets.Middleware.verifyingPaymaster(
    paymasterUrl,
    paymasterContext
  );
  // Initialize userop builder
  const signer = new ethers.Wallet(signingKey,provider);
  
  // Initialize the Builder
  const builder = await Presets.Builder.Kernel.init(
    signer, 
    rpcUrl, {
      paymasterMiddleware: paymaster
    }
  );
  const address = builder.getSender();
  console.log(`Account address: ${address}`);

  // Approve and send token
  const to = "0x28B556EB9CA5E3235A4251f36C98Dd9fbf316900"; ///random
  const token = "0x06365A63B7b8270f9B629f2FeE0c7ceaE591d86F";
  const value = "10";
  const calls = await approveAndSendToken(to, token, value);

  // Build & send
  // Connect to the client and send the user operation
const client = await Client.init(rpcUrl);
const res = await client.sendUserOperation(builder.executeBatch(calls), {
  onBuild: (op) => console.log("Signed UserOperation:", op),
});


  console.log(`UserOpHash: ${res.userOpHash}`);
  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
}

main().catch((err) => console.error("Error:", err));
