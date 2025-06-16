import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import App from './App';
import Signup from './Signup';
import Signin from './Signin';
import Graph from './Graphs';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [signupCredentials, setSignupCredentials] = useState({ name: "", email: "", password: "" });
    const [loginCredentials, setLoginCredentials] = useState({ email: "", password: "" });
    // const [sessionsCount,setSessionsCount] = useState(0);
    // const [timeInMinutes,setTimeInMinutes] = useState(0);
    const [sessions, setSessions] = useState(null);
    const [selectedYear,setSelectedYear] = useState(null);
    const [selectedMonth,setSelectedMonth] = useState(null);

    //timer states
    const [sessionLength, setSessionLength] = useState(2);
    const [breakLength, setBreakLength] = useState(1);
    const [numOfSessions, setNumOfSessions] = useState(3);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(sessionLength * 10);
    const [breakTimeLeft, setBreakTimeLeft] = useState(breakLength * 10);
    const [isTimerOn, setIsTimerOn] = useState(false);

    const profile = async () => {
        try {
            console.log("calling the /user/profile");
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, { withCredentials: true });
            console.log("response", response);
            setUserName(response.data.user.name)
            setUserEmail(response.data.user.email)
            setUserId(response.data.user.id);

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        profile();
        totalSessions();

    }, []);

    const signup = async (credentials) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/signup`, credentials, { withCredentials: true });

            console.log("sign-up response", response);
        } catch (err) {
            console.error(err);
        }
    }

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/signin`, credentials, { withCredentials: true })

            console.log("response", response)

            setUserId(response.user.id);
            setUserName(response.user.name);
            setUserEmail(response.user.email);
        } catch (err) {
            console.error(err);
        }
    }

    const session = async (timeInMinutes) => {
        try {

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/sessions`, { timeInMinutes }, { withCredentials: true });

            console.log("response sessions", response);

        } catch (err) {
            console.error(err);
        }
    }

    const totalSessions = async () => {
        console.log("calling totalSessions")
        try {


            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/number-of-sessions`, { withCredentials: true });
            console.log("response-num-of-sessions", response);

            // setSessionsCount(response.data.sessions);
            // setTimeInMinutes(response.data.totalTime._sum.timeInMinutes);
            setSessions(response.data.sessions);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <AuthContext.Provider value={{ userName, setUserName, userId, setUserId, userEmail, setUserEmail,profile, signupCredentials, setSignupCredentials, signup, loginCredentials, setLoginCredentials, login, sessionLength, setSessionLength, breakLength, setBreakLength, numOfSessions, setNumOfSessions, sessionTimeLeft, setSessionTimeLeft, breakTimeLeft, setBreakTimeLeft, isTimerOn, setIsTimerOn, session, totalSessions,/* sessionsCount,timeInMinutes */sessions,setSessions,selectedYear,setSelectedYear,selectedMonth,setSelectedMonth }}>{children}</AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}

export default function Root() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/signin' element={<Signin />} />
                    <Route path='/graph' element={<Graph />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}
