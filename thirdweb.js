//basic server for 

const {config} =require("dotenv")
config();

const  {ThirdwebSDK} = require("@thirdweb-dev/sdk")



  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "polygon",{
    secretKey:"U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg"
  });



async function createUserOp() {
  // Build & send
  const contract = await sdk.getContract("0x710E9161e8A768c0605335AB632361839f761374")

  const tx=await contract.erc721.claim(
    "0x9808A1AD4f7DF5992e22F7e21C12819fa98Ee54e",
    "1",
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    {"type":"BigNumber","hex":"0x00"},
    {
      "proof": [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      "quantityLimitPerWallet": {
        "type": "BigNumber",
        "hex": "0x00"
      },
      "pricePerToken": {
        "type": "BigNumber",
        "hex": "0x00"
      },
      "currency": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    },
    {}
  )
  const receipt=tx.receipt
  const claimedId=tx.id
  console.log(receipt, claimedId)
  
}

createUserOp()