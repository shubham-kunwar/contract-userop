//basic server for 

import { ethers,  } from "ethers";
import { config } from "dotenv";

config();

export async function approveAndSignNFToken(
  ERC721Contract:any,
  ERC721Address: string,
  ownerAddress:string,
  receiverAddress:string,
  tokenID: string,
):Promise<any[]> {


  const Id = ethers.BigNumber.from(tokenID);
  console.log(Id)
  const approve = {
    to: ERC721Address,
    value: ethers.constants.Zero,
    data: ERC721Contract.interface.encodeFunctionData("safeTransferFrom", [ownerAddress,receiverAddress, Id]),
  };

  // const send = {
  //   to: ERC721Address,
  //   value: ethers.constants.Zero,
  //   data: ERC721Contract.interface.encodeFunctionData("transfer", [receiverAddress, Id]),
  // };
  return [approve];
}




export async function mintNft(
  ownerAddress:string,
  ERC721Contract:ethers.Contract,
  ERC721Address:string
):Promise<any[]> {

  const allowlistProof=  { 
    "proof": [], 
    "quantityLimitPerWallet": "1", 
    "pricePerToken": "0", 
    "currency": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" 
 }

  const mint = {
    to:ERC721Address,
    value: ethers.constants.Zero,
    data: ERC721Contract.interface.encodeFunctionData("claim", [ownerAddress,1,"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",0,allowlistProof,[]]),
  };
  console.log(mint)
  return [mint];



}



