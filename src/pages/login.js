import React from 'react';
import Store from '../store/store'
import { useHistory } from "react-router-dom";
import { observer } from 'mobx-react'
import logo from '../assets/logo.png';

const Login = observer(() => {
  const history = useHistory()
  const [state, setState] = React.useState({
    email: "",
    password: "",
  })

  const hanChg = (e) => {
    const { name, value } = e.target
    setState({
      ...state,
      [name]: value
    })
  }

  return (
    <div className="landing">
        <div className="login-form-container">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>            
            <input type="email" name="email" placeholder="email => abc@busseinc.com" value={state.email} onChange={hanChg} />
            <input type="password" name="password" placeholder="password => ..." value={state.password} onChange={hanChg} />
            <button onClick={async () => {
                const query = `
                mutation Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        authorized
                    }
                }
                `          
                const variables = state
                try {
                await Store.setCookies(query, variables)            
                history.push("/sa")            
                } catch(err) {}

            }}>Login</button>        
        </div>
        <div className="help"><p>--help: <a href="mailto:jmodell@busseinc.com">jmodell@busseinc.com</a></p></div>
    </div>
  );
})

export default Login;
