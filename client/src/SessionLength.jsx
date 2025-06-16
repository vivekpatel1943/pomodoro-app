
import { useAuth } from "./Root";

function SessionLength(){
    const {sessionLength,setSessionLength,sessionTimeLeft,setSessionTimeLeft} = useAuth();

    const handleChange = (event) => {
        setSessionLength(event.target.value)
        setSessionTimeLeft(event.target.value*10)
    }

   /*  const handleSubmit = (formData) => {
        const sessionLength = formData.get('sessionLength');
        setSessionLength(sessionLength)
        setSessionTimeLeft(sessionLength*10)
    }
 */
    return(
        <div>
            <form /* action={handleSubmit} */>
                <label htmlFor="sessionLength">Enter the session Length: </label>
                <input id="sessionLength" name="sessionLength" value={sessionLength} onChange={handleChange}/>
                {/* <button type="submit">submit</button> */}
            </form>
        </div>
    )
}

export default SessionLength;