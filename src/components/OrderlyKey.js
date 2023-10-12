import {useWalletContext} from "../WalletContext";
import {getAddOrderlyKeyMsg, signEIP712} from "../utils/eip712.util";
import {getNewOrderlyKeyPair, getOrderlyKeyPairBySecretKey} from "../utils/orderly-key.util";
import {getAccountId} from "../utils/common.util";
import {announceOrderlyKey} from "../services/account.service";
import {useEffect, useState} from "react";


export default function OrderlyKey() {
    const {orderlyKey, setOrderlyKey, chainId, userAddress} = useWalletContext();
    const [keyPair, setKeyPair] = useState();

    useEffect(() => {
        if (!orderlyKey) {
           return;
        }
      getOrderlyKeyPairBySecretKey(orderlyKey).then(res => {
          console.log('res', res);
          setKeyPair(res)
      })

    }, [orderlyKey])


    const addKey = async () => {
        const orderlyKeyPair = await getNewOrderlyKeyPair();
        // 过期时间，单位小时
        const expireTime = 24;
        const eip712Data = getAddOrderlyKeyMsg(parseInt(chainId), orderlyKeyPair, ['read', 'trading'], expireTime);
        const signature = await signEIP712(userAddress, eip712Data);
        console.log('signature', signature);
        const accountId = getAccountId(userAddress);
        const msg = {};
        for (const [key, value] of Object.entries(eip712Data.message)) {
            msg[key] = value;
        }

        const res = await announceOrderlyKey({
            signature,
            userAddress,
            message: msg
        });
        if (res.success) {
            setOrderlyKey(orderlyKeyPair.privateKey);
            // 存在localstorage里面
            window.localStorage.setItem('OrderlyKey', JSON.stringify(orderlyKeyPair));
        }

    };

    const getFromLocalstorage = () => {
       const str = window.localStorage.getItem('OrderlyKey');
       if (!str) {
           alert('localstorage OrderlyKey is empty');
           return;
       }
       const orderlyKeyPair = JSON.parse(str);
        console.log(orderlyKeyPair);
        setOrderlyKey(orderlyKeyPair.privateKey);
    }
    return (
        <div>
            <h2>2. 检查OrderlyKey</h2>
            {!orderlyKey &&
                <div>
                    没有，创建OrderlyKey，
                    <button onClick={addKey}>创建</button>
                    <span>从localstorage里面获取<button style={{marginLeft: '10px'}} onClick={getFromLocalstorage}>获取</button></span>
                </div>
            }

            {
                orderlyKey &&
                <ul>
                    <li>
                        PrivateKey: {keyPair?.privateKey}
                    </li>
                    <li>
                        PublicKey: {keyPair?.publicKey}
                    </li>
                </ul>
            }


        </div>
    );
}