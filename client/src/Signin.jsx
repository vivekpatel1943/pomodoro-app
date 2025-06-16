import React from "react";
import { useState,useEffect } from "react";
import {useAuth} from './Root';

function Signin(){

    const {login,setLoginCredentials,loginCredentials} = useAuth();

    const handleChange = (event) => {
        setLoginCredentials({...loginCredentials,[event.target.name]:event.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        login(loginCredentials)
    }

    return(
        <form onSubmit={(e) => {
            handleSubmit(e)
        }}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" placeholder="johndoe@gmail.com" onChange={handleChange}/>
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" onChange={handleChange}/>
            <button type="submit">Submit</button>
        </form>
    )
}

export default Signin;

