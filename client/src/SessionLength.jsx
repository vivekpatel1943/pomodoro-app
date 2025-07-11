
import { useAuth } from "./Root";

function SessionLength() {
    const { sessionLength, setSessionLength, sessionTimeLeft, setSessionTimeLeft } = useAuth();

    const handleChange = (event) => {
        setSessionLength(event.target.value)
        setSessionTimeLeft(event.target.value * 10)
    }



    return (
        <div>
            <div className="relative flex items-center justify-center group">

                <input
                    id="sessionLength"
                    name="sessionLength"
                    value={sessionLength}
                    onChange={handleChange}
                    className="w-20 h-12 px-2 text-center border-2 font-bold text-2xl rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                    Set the work time
                </div>

            </div>
        </div>
    )
}

export default SessionLength;