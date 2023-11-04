import axios from 'axios';

const signerBaseUrl: string = process.env.SIGNER_BASEURL || "";

export async function SignUserOpViaAuth(contract:any,getUserOp: any, password: string, bearerToken: string) {
  try {
    console.log(getUserOp)
    const signatureResponse = await axios.post(
      `${signerBaseUrl}/auth/userOpsBuilder`,
      {
        contract,
        getUserOp,
        password,
      },
      {
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
      }
    );
    return signatureResponse
  } catch (error) {
    throw error;
  }
}
