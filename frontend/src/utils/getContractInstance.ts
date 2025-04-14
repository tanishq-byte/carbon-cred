import { ethers } from "ethers";
import abi from "../contracts/Registry.json"; // replace with actual ABI

export const getContractInstance = (contractAddress: string) => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, abi, signer);
};
