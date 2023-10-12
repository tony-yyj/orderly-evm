import {environment} from "../environment/environment";
import {getOrderlyKeyPairBySecretKey, handleSignature} from "./orderly-key.util";
import {getAccountId} from "./common.util";

async function requestMethod(url, method, params, headers) {
    headers = {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
    };

    if (['/usercenter/account'].some(urlStr => url.toString().indexOf(urlStr) !== -1)) {
        // need auth

        const accountId = getAccountId(localStorage.getItem('userAddress'));
        const str = window.localStorage.getItem('OrderlyKey');
        const orderlyKeyPair = JSON.parse(str);
        const authHeader = await handleSignature(url.toString(), method, method === 'delete' ? null :params, accountId, orderlyKeyPair.privateKey);
        Object.assign(headers, authHeader);
    }
    return fetch(url, {
        method,
        headers: headers || {},
        body: method === 'POST' ? JSON.stringify(params) : null,

    }).then(res => res.json())

}

function get (url, headers, params) {
    url = new window.URL(environment.apiUrl + url)
    if (typeof params === 'object') {
        url.search = new window.URLSearchParams(params);
    }
    return requestMethod(url, 'GET', params, headers);
}

function post(url, headers, params){

    url = new window.URL(environment.apiUrl + url)

    return requestMethod(url, 'POST', params, headers);
}



const RequestUtil = {
    get,
    post,
}

export default RequestUtil

