//basic server for 

import { ethers,  } from "ethers";
import { config } from "dotenv";

config();

export async function approveAndSignToken(
  ERC20Contract:any,
  ERC20Address: string,
  value: string,
):Promise<any[]> {

  
  const [symbol, decimals] = await Promise.all([
    ERC20Contract.symbol(),
    ERC20Contract.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(value, decimals);
  console.log(`Approving ${value} ${symbol}...`);
  
  const approve = {
    to: ERC20Address,
    value:amount,
    data: ERC20Contract.interface.encodeFunctionData("approve", [ERC20Address, amount]),
  };

  const send = {
    to: ERC20Address,
    value: amount,
    data: ERC20Contract.interface.encodeFunctionData("transfer", [ERC20Address, amount]),
  };

  console.log(approve,send)
  return [approve, send];
}


export async function approve(
  ERC20Contract:any,
  ERC20Address: string,
  value: string,
):Promise<any[]> {

  const decimals = await Promise.all([ERC20Contract.decimals()]);
  const amount = ethers.utils.parseUnits(value, decimals);
  console.log(amount,decimals)
  const approve = {
    to: ERC20Address,
    value:amount,
    data: ERC20Contract.interface.encodeFunctionData("approve", [ERC20Address, amount]),
  };

  const send = {
    to: ERC20Address,
    value: amount,
    data: ERC20Contract.interface.encodeFunctionData("transfer", [ERC20Address, amount]),
  };
  return [approve, send];
}

