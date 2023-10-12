import RequestUtil from "../utils/request.util";
import {environment} from "../environment/environment";

export function checkAccountIsExist(userAddress) {
    return RequestUtil.get('/v1/get_account', null, {address: userAddress, broker_id: environment.brokerId});
}

export function getRegistrationNonce() {
    return RequestUtil.get('/v1/registration_nonce');
}

export function registerUser(params) {

    return RequestUtil.post('/v1/register_account', null, params);
}

export function announceOrderlyKey(params) {
    return RequestUtil.post('/v1/orderly_key', null, params);
}

export function getAccountInfo(params) {
    return RequestUtil.get('/usercenter/account', null, params);
}