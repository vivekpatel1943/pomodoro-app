import React,{useState} from 'react';
import { useAuth } from './Root';

function BreakLength(){

    const {breakLength,setBreakLength,breakTimeLeft,setBreakTimeLeft} = useAuth(); 

    const handleChange = (event) => {
        setBreakLength(event.target.value)
        setBreakTimeLeft(event.target.value*10)
    } 

  /*   const handleSubmit = (formData) => {
        const breakLength = formData.get('breakLength');
        setBreakLength(breakLength)
        setBreakTimeLeft(breakLength)
    } */

    return (
        <form /* action={handleSubmit} */>
            <label htmlFor='breakLength'>Enter break Length:</label>
            <input id='breakLength' name='breakLength' value={breakLength} onChange={handleChange}/>
            {/* <button type='submit'>submit</button> */}
        </form>
    )
}

export default BreakLength;