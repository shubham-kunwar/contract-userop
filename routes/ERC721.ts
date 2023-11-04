import { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { approveAndSignNFToken,mintNft } from "../services/Erc721";
import { SignUserOpViaAuth } from "../services/SignUserOpViaAuth";
import { ethers } from "ethers";


function initializeERC721Routes(
  app: Application,
  ERC721Contract: ethers.Contract,
  ERC721Address: string
) {
  // Handle POST requests to add a position
  app.post("/transferNft", async (req: Request, res: Response) => {
    try {
      const { receiverAddress, tokenID, password } = req.body;
      console.log(req.body);

      // Extract the authorization token from the request headers
      const bearerToken = req.headers.authorization as string;

      if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Extract the JWT token (remove 'Bearer ' from the token string)
      const token = bearerToken.split(" ")[1];

      // Verify and decode the JWT token
      interface DecodedToken {
        smartWalletAddress: string; // Adjust the type to match the actual data type of walletaddress
        // Add other properties if present in the decoded token
      }
      
      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      ) as DecodedToken;
      
      const ownerAddress = decoded.smartWalletAddress;

      
      const getUserOp = await approveAndSignNFToken(
        ERC721Contract,
        ERC721Address,
        ownerAddress,
        receiverAddress,
        tokenID
      );

         // Relay the transaction via smart wallet
         try {
          // Sign User Operation and wait for the result
          const signUserOp: any = await SignUserOpViaAuth(
            ERC721Contract,
            getUserOp,
            password,
            bearerToken
          );
          // console.log(signUserOp)
  
          // Respond to the client
          if (signUserOp.status == 200) {
            // Respond to the client with success
  
            res.status(200).json({
              message: "Token Approved and sent",
              details: signUserOp.data,
            });
          } else {
            // Handle the case where the relayed transaction failed
            res.status(400).json({ error: signUserOp });
          }
        } catch (error: any) {
  
          res.status(500).json({
            message: "Failed to Submit user Operation",
            error: error, // Include the error message for debugging purposes
          });
        }
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.reason || error.message });
    }
  });

  app.post("/mint", async (req: Request, res: Response) => {
    try {
      const {  password } = req.body;
      console.log(req.body,password);

      // Extract the authorization token from the request headers
      const bearerToken = req.headers.authorization as string;

      if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Extract the JWT token (remove 'Bearer ' from the token string)
      const token = bearerToken.split(" ")[1];

         // Verify and decode the JWT token
         interface DecodedToken {
          smartWalletAddress: string; // Adjust the type to match the actual data type of walletaddress
          // Add other properties if present in the decoded token
        }
      // Verify and decode the JWT token

      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      ) as DecodedToken;
      
      const ownerAddress = decoded.smartWalletAddress;
      const getUserOp = await mintNft(ownerAddress,ERC721Contract,ERC721Address);

      // Relay the transaction via smart wallet
      try {
        // Sign User Operation and wait for the result
        const signUserOp: any = await SignUserOpViaAuth(
          ERC721Contract,
          getUserOp,
          password,
          bearerToken
        );
        console.log(signUserOp)

        // Respond to the client
        if (signUserOp.status == 200) {
          // Respond to the client with success

          res.status(200).json({
            message: "NFT Claimed Successfully",
            details: signUserOp.data,
          });
        } else {
          // Handle the case where the relayed transaction failed
          res.status(400).json({ error: signUserOp });
        }
      } catch (error: any) {

        res.status(500).json({
          message: "Failed to Submit user Operation",
          error: error, // Include the error message for debugging purposes
        });
      }
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  });






}

export { initializeERC721Routes };
