import {useWalletContext} from "../WalletContext";
import {convertChainIdNumberToHex} from "../utils/common.util";

const ArbitrumGeoli = {
    chainId: '421613',
    label: 'Arbitrum Goerli',
    token: 'AGOR',
    requestRpc: 'https://goerli-rollup.arbitrum.io/rpc'
};

export default function Chain() {
    const {chainId, setChainId} = useWalletContext();

    const changeChain = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: convertChainIdNumberToHex(ArbitrumGeoli.chainId) }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: convertChainIdNumberToHex(ArbitrumGeoli.chainId),
                                chainName: ArbitrumGeoli.label,
                                rpcUrls: [ArbitrumGeoli.requestRpc] /* ... */,
                            },
                        ],
                    });

                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: convertChainIdNumberToHex(ArbitrumGeoli.chainId) }],
                    });

                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        } finally {
            setChainId(window.ethereum.chainId);
        }



    };

    return (
        <div>
            <h2>0. 检查当前链，testnet需要在Arb Geoli</h2>

            当前链ID： {parseInt(chainId)}
            {parseInt(chainId) === Number(ArbitrumGeoli.chainId) ?
                <div>当前链是{ArbitrumGeoli.label}</div>
                :
                <button style={{marginLeft: '10px'}} onClick={changeChain}>切换到Arbitrum Geoli</button>
            }

        </div>
    );
}