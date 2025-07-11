import React, { useState, useEffect } from 'react';
import { useAuth } from './Root';


function NumOfSessions() {

    const { numOfSessions, setNumOfSessions } = useAuth();

    const handleChange = (event) => {
        setNumOfSessions(event.target.value);
    }

    console.log(numOfSessions);

    return (
        <div className='mt-5'>
            <form>
                {/* <label htmlFor='numOfSessions'>how many work sessions do you want?</label> */}
                {/* <input name='numOfSessions' id='numOfSessions' value={`${numOfSessions}`} onChange={handleChange} className='w-15 h-10 border-2 font-bold text-2xl'/> */}
                <select name='numOfSessions' id='numOfSessions' defaultValue={3} onChange={handleChange}>
                    <option value="none" disabled>
                        select
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                </select>
            </form>
        </div>
    )
}

export default NumOfSessions;