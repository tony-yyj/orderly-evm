import {ethers} from "ethers";
import {environment} from "../environment/environment";
import moment from "moment";

const definedTypes = {
    EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
    ],
    Registration: [
        { name: 'brokerId', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'timestamp', type: 'uint64' },
        { name: 'registrationNonce', type: 'uint256' },
    ],
    Withdraw: [
        { name: 'brokerId', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'receiver', type: 'address' },
        { name: 'token', type: 'string' },
        { name: 'amount', type: 'uint256' },
        { name: 'withdrawNonce', type: 'uint64' },
        { name: 'timestamp', type: 'uint64' },
    ],
    AddOrderlyKey: [
        { name: 'brokerId', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'orderlyKey', type: 'string' },
        { name: 'scope', type: 'string' },
        { name: 'timestamp', type: 'uint64' },
        { name: 'expiration', type: 'uint64' },
    ],
    SettlePnl: [
        { name: 'brokerId', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'settleNonce', type: 'uint64' },
        { name: 'timestamp', type: 'uint64' },
    ],
};
export function getRegistrationMsg(brokerId, chainId, registrationNonce) {
    const primaryType = 'Registration';
    const timestamp = new Date().getTime();
    const typeDefinition = {
        EIP712Domain: definedTypes.EIP712Domain,
        [primaryType]: definedTypes[primaryType],
    };
    const message = {
        brokerId: brokerId,
        chainId: Number(chainId),
        timestamp: timestamp,
        registrationNonce: registrationNonce,
    };

    return {
        domain: getDomain(chainId),
        message: message,
        primaryType: 'Registration',
        types: typeDefinition,
    };
}

export function getAddOrderlyKeyMsg(chainId, keyPair, scope, expireTime = 0) {
    const primaryType = 'AddOrderlyKey';
    const timestamp = new Date().getTime();

    const expiration =
        expireTime === 0 ? moment(timestamp).add(365, 'days').startOf('days').valueOf() : moment(timestamp).add(30, 'days').valueOf();
    const typeDefinition = {
        EIP712Domain: definedTypes.EIP712Domain,
        [primaryType]: definedTypes[primaryType],
    };
    const message = {
        brokerId: environment.brokerId,
        orderlyKey: keyPair.publicKey,
        scope: scope.join(','),
        chainId,
        timestamp: timestamp,
        expiration,
    };

    return {
        domain: getDomain(chainId),
        message: message,
        primaryType,
        types: typeDefinition,
    };
}

export function getDomain(chainId, onChainDomain) {
    // 只有withdraw和settlepnl才需要验证合约。
    const verifyContractAddress = '';
    return {
        name: 'Orderly',
        version: '1',
        chainId,
        verifyingContract: onChainDomain ? verifyContractAddress : '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    };
}

export function signEIP712(accountId, data) {
    const method = 'eth_signTypedData_v4';
    const params = [accountId, data];



    return window.ethereum.request({
        method,
        params,
    })
}

