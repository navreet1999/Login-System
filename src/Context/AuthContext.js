import React, {createContext,useState,useEffect} from 'react';
import AuthService from '../Services/AuthService';

// this given us off-context object and give us a provider in a consumer so a provider anything thats wrapped within a provider 
//  have access to the global state  but also we have to consume it(consume the global state)
export const AuthContext = createContext();

export default ({ children })=>{    //children in thi case is going to refer to the components that we want to wrap our provider arround
   
    const [user,setUser] = useState(null);    // HOOKS-> used to maintain the state of functional component
                                              // user is initialized to value NULL and the set user upadte the User 
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [isLoaded,setIsLoaded] = useState(false);

    useEffect(()=>{
        AuthService.isAuthenticated().then(data =>{
            setUser(data.user);
            setIsAuthenticated(data.isAuthenticated);
            setIsLoaded(true);
        });
    },[]);

    return (
        <div>
            {!isLoaded ? <h1>Loading....</h1> : 
            <AuthContext.Provider value={{user,setUser,isAuthenticated,setIsAuthenticated}}>
                { children }
            </AuthContext.Provider>}
        </div>
    )
}