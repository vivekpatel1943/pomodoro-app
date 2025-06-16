import React, { useEffect, useState } from 'react';
import { useAuth } from './Root';


function Signup() {

    const { signupCredentials, setSignupCredentials, signup } = useAuth()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        setPassword: "",
        confirmPassword: ""
    })

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value.trim() });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (formData.setPassword === formData.confirmPassword) {
            const credentials = { name: formData.name, email: formData.email, password: formData.confirmPassword }

            setSignupCredentials(credentials);
            signup(credentials);
        } else {
            console.log("passwords don't match...")
        }
    }

    return (
        <form onSubmit={(event) => {
            handleSubmit(event);
        }}>
            <label htmlFor='name'>name:</label>
            <input name='name' id='name' placeholder='Jonn Doe' value={formData.name} onChange={handleChange} />
            <label htmlFor='email'>Email:</label>
            <input name='email' id='email' placeholder='johndoe@gmail.com' value={formData.email} onChange={handleChange} />
            <label htmlFor='set-password'>Set-Password:</label>
            <input id='set-password' name='setPassword' value={formData.setPassword} onChange={handleChange} />
            <label htmlFor='confirm-password'>Confirm-Password:</label>
            <input id='confirm-password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} />
            <button type='submit'>Submit</button>
        </form>
    )
}

export default Signup;