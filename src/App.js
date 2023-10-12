import logo from './logo.svg';
import './App.css';
import Connect from "./Connect";
import {WalletContextProvider} from "./WalletContext";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Chain from "./components/Chain";
import OrderlyKey from "./components/OrderlyKey";
import Account from "./components/Account";

function App() {
  return (
    <div className="App">
        <WalletContextProvider>
            <Header/>
            <Chain/>
            <SignIn/>
            <OrderlyKey/>
            <Account/>

        </WalletContextProvider>

    </div>
  );
}

export default App;
