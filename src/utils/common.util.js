import {AbiCoder, keccak256, solidityPackedKeccak256} from "ethers";
import {environment} from "../environment/environment";

export function calculateStringHash(input) {
    return solidityPackedKeccak256(['string'], [input]);
}
export const getAccountId = (userAddress) => {
    const abicoder = AbiCoder.defaultAbiCoder();
    return keccak256(abicoder.encode(['address', 'bytes32'], [userAddress, calculateStringHash(environment.brokerId)]));
};

export const convertChainIdNumberToHex = (chainId) => {
    return `0x${Number(chainId).toString(16)}`;
};