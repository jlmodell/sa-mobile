import React from 'react';
import auth from '../store/auth.store'
import { useHistory } from "react-router-dom";
import { observer } from 'mobx-react'
import logo from '../assets/logo.png';
import github from '../assets/GitHub-Mark-Light-64px.png'
import jm_logo from '../assets/jm-logo/default.png'

let logo_to_use;

const Login = observer(() => {
  const history = useHistory()

  if (process.env.REACT_APP_DUMMY) {
      logo_to_use = jm_logo
  } else {
      logo_to_use = logo
  }

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
                <img height='250' src={logo_to_use} alt="logo" />
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
        <div className="github-logo"><a href="https://github.com/jlmodell/sa-mobile" target="_blank"><img src={github} alt="github" height="64"/></a></div>
    </div>
  );
})

export default Login;
