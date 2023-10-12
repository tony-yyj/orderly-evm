import {checkAccountIsExist, getRegistrationNonce, registerUser} from "../services/account.service";
import {useWalletContext} from "../WalletContext";
import {useState} from "react";
import styled from "styled-components";
import {environment} from "../environment/environment";
import {getRegistrationMsg, signEIP712} from "../utils/eip712.util";

const RegisterStyled = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
`;

function Register() {
    const {chainId, userAddress} = useWalletContext();
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const register = async () => {
        const registrationNonce = await getRegistrationNonce();
        console.log('res', registrationNonce);
        const eip712Data = getRegistrationMsg(environment.brokerId, parseInt(chainId),registrationNonce.data.registration_nonce);
        console.log('eip712Data', eip712Data);
        const signature = await signEIP712(userAddress, eip712Data);
        console.log('signature', signature);
        const params = {
            message: eip712Data.message,
            signature,
            userAddress: userAddress,
        };

        const res = await registerUser(params);
        console.log('res', res);
        if (res.success) {
           setRegisterSuccess(true);
        }
    };
    return (
        <RegisterStyled>
            <div> not exit, need register</div>
            <button style={{marginLeft: '10px'}} onClick={register}>Register</button>
            {registerSuccess && <div>register Success ✅</div>}
        </RegisterStyled>
    );
}

export default function SignIn() {
    const [isExist, setIsExist] = useState(null);
    const {userAddress} = useWalletContext();
    const checkAccount = () => {
        checkAccountIsExist(userAddress).then(res => {
            if (res.code === -1607) {

                setIsExist(false);
                return;
            }
            if (res.success) {
                setIsExist(true);

            }
            console.log('res', res);

        });
    };
    return (
        <div>
            <h2>1. 检查userAddress是否注册？</h2>
            <div>
                <button onClick={checkAccount}>Check userAddress is Exit</button>
                {isExist === false && <Register/>}
                {isExist === true && <div>already exist ✅</div>}
            </div>

        </div>
    );
}