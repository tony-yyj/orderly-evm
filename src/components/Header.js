import styled from "styled-components";
import Connect from "../Connect";
import {useWalletContext} from "../WalletContext";

const HeaderStyled = styled.div`
   display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #ccc;
`

const UserAddress = ({userAddress}) => {
   return (
      <div>
          Current userAddress: {userAddress}
      </div>
   )
}

export default function Header() {
    const {userAddress} = useWalletContext();
    return (
        <HeaderStyled>
           <div>Orderly Evm Demo</div>
            <div>
                {userAddress ?
                    <UserAddress userAddress={userAddress}/>
                    :
                    <Connect/>
                }
            </div>
        </HeaderStyled>

    )
}