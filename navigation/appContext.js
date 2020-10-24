import React, { useState,useEffect } from 'react'
import AuthContext from './AuthContext'
import {getConnectedUser} from '../rest/userApi';
import { AsyncStorage } from 'react-native';

export default  function AppContext(props){
    const [user, setUser] = useState(null)
    const [darkMode,setDarkMode]=useState(false);
     const token_init = ""
    const [token,setToken]=useState(token_init)
    
    useEffect(() => {
        if (token) {
            getConnectedUser().then(res=>{
                console.log(res)
                setUser(res.data.connectedUser)
            }).catch(err=>{
                console.log(err)
            })
               
        } 


    }, [token])

    const modifyDarkMode =()=>{
        setDarkMode(darkMode=>!darkMode);
    }
    
    const LoginHandler = async ({ user, token }) => {
        console.log(user);
        await AsyncStorage.setItem('token', token)
        setToken(token);
        setUser(user);
    }

    const logoutHandler = async () => {

      await  AsyncStorage.removeItem('token')
        setToken(null);

        setUser(null)
    }

return(
<AuthContext.Provider value={{
    darkMode:darkMode,
    user:user,
    LoginHandler:LoginHandler,
    logoutHandler:logoutHandler,
    setDarkMode:modifyDarkMode
}
}>

{props.children}
</AuthContext.Provider>
)


}