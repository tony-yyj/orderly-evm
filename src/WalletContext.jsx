import React, {ReactNode, createContext, useContext, useMemo, useState} from 'react';


const defaultContextValue= {
    userAddress: null,
    chainId: null,
};

const WalletContext = createContext(defaultContextValue);

export const WalletContextProvider = ({children}) => {
    const [userAddress, setUserAddress] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [orderlyKey, setOrderlyKey] = useState(null)

    const value = useMemo(
        () => ({
            userAddress,
            setUserAddress,
            chainId,
            setChainId,
            orderlyKey,
            setOrderlyKey,
        }),
        [userAddress, setUserAddress, chainId, setChainId, orderlyKey, setOrderlyKey],
    );

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => useContext(WalletContext);
