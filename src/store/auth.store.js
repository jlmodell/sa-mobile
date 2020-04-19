import { observable } from 'mobx';
import axios from 'axios'
import jwt from 'jsonwebtoken'

const api = "https://busseweb.com:9090/login"

const auth_store = observable({
    email: '',
    password: '',
    token: localStorage.getItem("token") || null,
    isAuth: false,
    async checkTokenExp() {
        let exp

        if (this.token) {
            exp = jwt.decode(this.token).exp
            if (exp < Date.now() / 1000) {
                this.deleteToken()
                this.isAuth = false
            }
            this.isAuth = true            
        }        
    },
    async setToken() {        
        const res = await axios.post(api, {
            email: this.email, 
            password: this.password
        })        

        if (res.status === 201) {
            this.token = res.data.token
            localStorage.setItem("token", res.data.token)          
            this.isAuth = true            
        }                

        return this.isAuth
    },
    deleteToken() {
        this.token = ''
        localStorage.removeItem("token")
    }
})

export default auth_store