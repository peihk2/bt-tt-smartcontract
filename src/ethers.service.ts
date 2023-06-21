import {ethers} from "ethers";
import erc20Abi from "./erc20Abi.json";

export const useGetContractByAddress = () => {
    if (window?.ethereum == null)
        return alert("MetaMask not installed; using read-only defaults");
    const contractAddress = "0x42C2Bd247fbe4804C52999f33105Ad705Dee3bC5";
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, erc20Abi, signer);
}