import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { Presets, Client } from 'userop';

dotenv.config();
const signingKey = process.env.SIGNING_KEY || '';
const rpcUrl = process.env.RPC_URL || '';
const paymasterUrl = process.env.PAYMASTER_URL || '';

async function main() {
  try {
    const ethersProvider = ethers.getDefaultProvider(rpcUrl);
    const wallet = new ethers.Wallet(signingKey, ethersProvider);
    const TOKEN_ADDRESS = '0x06365A63B7b8270f9B629f2FeE0c7ceaE591d86F';

    const destination = wallet.address;
    const amount = ethers.utils.parseUnits(JSON.stringify(100), 6);

    const ERC20_ABI = require("./abi/abi.json");

    const tokenContract = new ethers.Contract(
      TOKEN_ADDRESS,
      ERC20_ABI,
      ethersProvider
    );

    // Encode the transfer function
    const transferData = tokenContract.interface.encodeFunctionData(
      'transfer',
      [destination, amount]
    );

    // Initialize the paymaster
    const paymasterContext = {
      type: 'payg',
    };
    const paymaster = Presets.Middleware.verifyingPaymaster(
      paymasterUrl,
      paymasterContext
    );

    // Initialize userop builder
    const builder = await Presets.Builder.Kernel.init(wallet, rpcUrl, {
      paymasterMiddleware: paymaster,
    });

    const calls = [
      {
        to: TOKEN_ADDRESS,
        value: ethers.constants.Zero,
        data: transferData,
      },
    ];

    // Build & send
    const client = await Client.init(rpcUrl);
    const res = await client.sendUserOperation(builder.executeBatch(calls), {
      onBuild: (op) => console.log('Signed UserOperation:', op),
    });

    console.log(`UserOpHash: ${res.userOpHash}`);
    console.log('Waiting for transaction...');
    const ev = await res.wait();
    console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

    return ev?.transactionHash;
  } catch (error) {
    console.error('Error in sendTokenUsingUserOp:', error);
    return null;
  }
}

main()