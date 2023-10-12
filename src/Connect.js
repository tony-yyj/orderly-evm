import {useWalletContext} from "./WalletContext";

export default function Connect(){
    const {userAddress, setUserAddress, setChainId} = useWalletContext();
    const connectMetamask = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        console.log('accounts', accounts);
        setUserAddress(accounts[0]);
        localStorage.setItem('userAddress', accounts[0]);

        setChainId(window.ethereum.chainId);


    }
    return (
        <div>
            <button onClick={connectMetamask}>connect metamask</button>
        </div>
    )
}