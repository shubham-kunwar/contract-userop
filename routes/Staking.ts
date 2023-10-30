import { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { approveAndSignNFToken } from "../services/Erc721";
import { SignUserOpViaAuth } from "../services/SignUserOpViaAuth";
function initializeRoutes(
  app: Application,
  ERC20Contract: any,
  ERC20Address: string
) {

  // Handle POST requests to add a position


  
}

export { initializeRoutes };
