import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const getContract = (contractAddress: string, contractAbi: any) => {
  if (!window.ethereum) {
    throw new Error("Metamask is not available");
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractAbi, signer);
  } catch (error: any) {
    console.error(error);
    throw new Error(`Error initiating the contract. Reason: ${error.message}`);
  }
};
