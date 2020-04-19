import React from 'react';
import auth from '../store/auth.store'
import { useHistory } from "react-router-dom";
import { observer } from 'mobx-react'
import logo from '../assets/logo.png';

const Login = observer(() => {
  const history = useHistory()

  const handleChange = (e) => {
    const {name, value} = e.target
    auth[name] = value
  }

  React.useEffect(() => {
    auth.checkTokenExp()    
    if (auth.isAuth) history.push("/sa")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className="landing">
        <div className="login-form-container">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>            
            <input type="email" name="email" placeholder="email => abc@busseinc.com" value={auth.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="password => ..." value={auth.password} onChange={handleChange} />
            <button onClick={async () => {
                const isValid = await auth.setToken()                

                if (!isValid) {
                  alert("Check your credentials and try again.")
                  return
                }
                history.push("/sa")
            }}>Login</button>        
        </div>
        {/* <div className="help"><p>--help: <a href="mailto:jmodell@busseinc.com">jmodell@busseinc.com</a></p></div> */}
    </div>
  );
})

export default Login;
