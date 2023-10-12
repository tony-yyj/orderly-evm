import * as ed from '@noble/ed25519';
import { decodeBase58, encodeBase58, ethers } from 'ethers';
import {environment} from "../environment/environment";

function retry(operation, maxRetries = 99) {
    return new Promise((resolve, reject) => {
        let retries = 0;
        const retryOperationWrapper = async () => {
            try {
                const result = await operation();
                resolve(result);
            } catch (error) {
                retries++;
                console.log('-- retries', retries);
                if (retries < maxRetries) {
                    retryOperationWrapper();
                } else {
                    reject(error);
                }
            }
        };
        retryOperationWrapper();
    });
}

export async function generateOrderlyKeyPair() {
    return new Promise((resolve, reject) => {
        const privKey = ed.utils.randomPrivateKey(); // Secure random private key
        const privateKey = encodeBase58(privKey);
        if (privateKey.length !== 44) {
            reject(new Error('key error'));
        }

        ed.getPublicKeyAsync(privKey).then((pubKey) => {
            const orderlyKeyPair = {
                publicKey: `ed25519:${encodeBase58(pubKey)}`,
                privateKey: encodeBase58(privKey),
            };
            resolve(orderlyKeyPair);
        });
    });
}



export async function getNewOrderlyKeyPair() {
    try {
        // retry是为了排除不合适的key，比如少一位的key是无法用的
        return await retry(generateOrderlyKeyPair);
    } catch (error) {
        return error;
    }
}

export async function getOrderlyKeyPairBySecretKey(privateKey) {
    const secretKey = decodeBase58(privateKey).toString(16);

    const pubKey = await ed.getPublicKeyAsync(secretKey);
    const orderlyKeyPair = {
        publicKey: `ed25519:${encodeBase58(pubKey)}`,
        privateKey: privateKey,
    };
    return orderlyKeyPair;
}

export async function handleSignature(url, method, params, accountId, privateKey) {
    const urlParam = url.split(environment.apiUrl)[1];
    const timestamp = new Date().getTime().toString();
    const message = [timestamp, method.toUpperCase(), urlParam, params ? JSON.stringify(params) : ''].join('');

    const signObj = await signatureByOrderlyKey(message, privateKey);

    return {
        'orderly-account-id': accountId,
        'orderly-key': signObj.publicKey,
        'orderly-timestamp': timestamp,
        'orderly-signature': signObj.signature,
    };
}

const base64url = function (aStr) {
    return aStr.replace(/\+/g, '-').replace(/\//g, '_');
};


export async function signatureByOrderlyKey(message, privateKey) {
    const secretKey = decodeBase58(privateKey).toString(16);
    const u8 = Buffer.from(message);

    const signature = await ed.signAsync(u8, secretKey);

    const signHex = Buffer.from(signature).toString('base64');

    const b64 = base64url(signHex);
    const pubKey = await ed.getPublicKeyAsync(secretKey);
    const publicKey = `ed25519:${ethers.encodeBase58(pubKey)}`;
    return {
        signature: b64,
        publicKey,
    };
}

