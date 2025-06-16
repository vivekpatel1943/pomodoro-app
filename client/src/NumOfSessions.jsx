import React,{useState,useEffect} from 'react';
import {useAuth} from './Root';


function NumOfSessions(){
   
    const {numOfSessions,setNumOfSessions} = useAuth();

    const handleChange = (event) => {
        setNumOfSessions(event.target.value);
    }

    console.log(numOfSessions);

    return(
        <div>
            <form>
                <label htmlFor='numOfSessions'>how many work sessions do you want?</label>
                <input name='numOfSessions' id='numOfSessions' value={numOfSessions} onChange={handleChange}/>
            </form>
        </div>
    )
}

export default NumOfSessions;