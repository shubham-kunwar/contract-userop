import { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { approveAndSignToken } from "../services/Erc20";
import { SignUserOpViaAuth } from "../services/SignUserOpViaAuth";
function initializeRoutes(
  app: Application,
  ERC20Contract: any,
  ERC20Address: string
) {
  // Handle POST requests to add a position
  app.post("/sendErc20Token", async (req: Request, res: Response) => {
    try {
      const { receiverAddress, value, password } = req.body;
      console.log(req.body);

      // Extract the authorization token from the request headers
      const bearerToken = req.headers.authorization as string;

      if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Bearer token not" });
      }

      // Extract the JWT token (remove 'Bearer ' from the token string)
      const token = bearerToken.split(" ")[1];

        // Verify and decode the JWT token
try {
  const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
  // The token is valid, proceed with your logic
} catch (err) {
  console.error("JWT verification error:", err);
  return res.status(401).json({ error: "Unauthorized" });
}


      const getUserOp = await approveAndSignToken(
        ERC20Contract,
        ERC20Address,
        value
      );

      console.log(getUserOp)

      // Relay the transaction via smart wallet
      try {
        // Sign User Operation and wait for the result
        const signUserOp: any = await SignUserOpViaAuth(
          ERC20Contract,
          getUserOp,
          password,
          bearerToken
        );
        console.log(signUserOp)

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
      res.status(500).json({ error: error.reason || error.message });
    }
  });
}

export { initializeRoutes };
