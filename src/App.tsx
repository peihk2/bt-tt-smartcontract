import {Box, Button, Center, Flex, Input, Link, Text, VStack} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {useGetContractByAddress} from "./ethers.service";
import {ethers, utils} from "ethers";

function App() {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState("--");
    const [txHash, setTxHash] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const contract = useGetContractByAddress();
    const inputAddressToGetBalanceRef = useRef<HTMLInputElement>(null);
    const inputAddressToMintRef = useRef<HTMLInputElement>(null);
    const inputAmountToMintRef = useRef<HTMLInputElement>(null);

    const handleSwitchNetwork = async () => {
        const hex_chainId = ethers.utils.hexValue(421613);
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: hex_chainId}],
        });
    }

    const handleGetBalance = async () => {
        if (!account)
            return alert("Pls connect wallet first");
        const address = inputAddressToGetBalanceRef.current?.value;
        if (!address) return;
        const balance = await contract?.balanceOf(address);
        setBalance(utils.formatEther(balance));
    }

    const handleConnectWallet = async () => {
        const [address] = await window.ethereum.request({method: "eth_requestAccounts"});
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const {chainId} = await provider.getNetwork();
        if (chainId !== 421613) {
            await handleSwitchNetwork();
        }

        setAccount(address);
    };

    const handleMint = async () => {
        if (!account)
            return alert("Pls connect wallet first");
        const address = inputAddressToMintRef.current?.value;
        const amount = inputAmountToMintRef.current?.value;
        if (!address || !amount) return;
        const tx = await contract?.mint(address, utils.parseEther(amount));
        setTxHash(tx?.hash);
        setLoading(true);
        await tx?.wait();
        setLoading(false)
    }


    return (
        <Center w="100vw" h="100vh">
            <VStack w="600px" alignItems={"flex-start"} spacing={"20px"}>
                <Flex gap={"20px"} alignItems={"center"}>
                    <Text>Account: </Text>
                    {account ? <Text>{account}</Text> : <Button onClick={handleConnectWallet}>Connect wallet</Button>}
                </Flex>
                <Box>
                    <Text fontWeight={"bold"}>Get balance by address:</Text>
                    <Flex gap={"10px"}>
                        <Input placeholder="Address" ref={inputAddressToGetBalanceRef}/>
                        <Button onClick={handleGetBalance} disabled={!account}>Get balance</Button>
                    </Flex>
                    <Text>Balance: {balance}</Text>
                </Box>
                <Box>
                    <Text fontWeight={"bold"}>Mint Token:</Text>
                    <VStack alignItems={"flex-start"} spacing="5px">
                        <Input placeholder="Address" ref={inputAddressToMintRef}/>
                        <Input placeholder="Amount" ref={inputAmountToMintRef}/>
                        <Button onClick={handleMint} isLoading={loading} disabled={!account}>Mint</Button>
                        {txHash && <Link href={`https://goerli.arbiscan.io/tx/${txHash}`} isExternal>View Your
                            Transaction</Link>}
                    </VStack>
                </Box>
            </VStack>
        </Center>
    );
}

export default App;
