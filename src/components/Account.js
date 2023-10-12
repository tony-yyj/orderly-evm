import {useState} from "react";
import {getAccountInfo} from "../services/account.service";

export default function Account() {

    const [accountInfo, setAccountInfo] = useState();

    const getInfo = () => {
        getAccountInfo().then(res => {
            console.log(res);
            if (res.success) {

                setAccountInfo(res.data.account);
            }
        });
    };

    return (
        <div>
            <h2>3. 签名Cefi请求</h2>
            <button onClick={getInfo}>get Account Info</button>
            {accountInfo &&
                <ul>
                    <li>UserId: {accountInfo?.user_id}</li>
                    <li>Location: {accountInfo?.location}</li>
                </ul>
            }

        </div>
    );
}