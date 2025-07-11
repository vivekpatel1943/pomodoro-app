import { useState, useEffect, useRef } from 'react'
import { useAuth } from './Root';
// import NumOfSessions from './NumOfSessions.jsx';
import SessionLength from './SessionLength.jsx';
import BreakLength from './BreakLength.jsx';
import Audio from './Audio.jsx'
// import { subscribeUser } from './SubscribeUser.js';
import axios from 'axios';

function App() {

  const { breakLength, sessionLength, setSessionLength, setBreakLength, setNumOfSessions, numOfSessions, sessionTimeLeft, setSessionTimeLeft, breakTimeLeft, setBreakTimeLeft, isTimerOn, setIsTimerOn, session, getAndSetToken, sendNotifications, userId } = useAuth();

  const [isWorkTimeOn, setIsWorkTimeOn] = useState(true);
  // const [isBreakTimeOn, setIsBreakTimeOn] = useState(false);
  // const [countSessions, setCountSessions] = useState(0);
  console.log("breakLength", breakLength)

  // const [isTimerOn, setIsTimerOn] = useState(false);

  // const [time, setTime] = useState(null);
  const workIntervalRef = useRef(null);
  const breakIntervalRef = useRef(null);

  const audioRef = useRef(null);

  // const intervalRef = useRef(null);
  console.log("session time left", typeof (sessionTimeLeft));
  console.log("break time left", typeof (breakTimeLeft))
  const minute = Math.floor((isWorkTimeOn ? sessionTimeLeft : breakTimeLeft) / 10);
  const second = Math.floor((isWorkTimeOn ? sessionTimeLeft : breakTimeLeft) % 10);

  const workSession = () => {
    workIntervalRef.current = setInterval(() => {
      // this is how the time decreases by one , every second and the clock actually functions,
      setSessionTimeLeft((prev) => {
        if (prev < 1) {
          clearInterval(workIntervalRef.current);
          workIntervalRef.current = null;
          setIsWorkTimeOn(false);
          setIsTimerOn(false)
          console.log("session lengthjnjkhkkk", sessionLength)
          // to save the session in the database
          session(sessionLength);
          sendNotifications("pomodoro", "good work , you want a break??");
          setSessionTimeLeft(sessionLength * 10);
          // setCountSessions((prev) => prev + 1)

          //play the audio
          if (audioRef.current) {
            audioRef.current.play();

            setTimeout(() => {
              audioRef.current.pause()
            }, 10000)
          }

          // workSessionFinishNotification();
        }
        return prev - 1;
      })
    }, 1000)
  }

  if (isTimerOn && (!isWorkTimeOn)) {
    audioRef.current.pause()
  }

  const breakSession = () => {
    breakIntervalRef.current = setInterval(() => {
      setBreakTimeLeft((prev) => {
        if (prev < 1) {
          clearInterval(breakIntervalRef.current);
          breakIntervalRef.current = null;
          setIsTimerOn(false)
          setIsWorkTimeOn(true);
          setBreakTimeLeft(breakLength * 10);
          sendNotifications("pomodoro", "the break sessions , so you want to get back to work??")
          //play the audio
          if (audioRef.current) {
            audioRef.current.play();

            setTimeout(() => {
              audioRef.current.pause()
            }, 10000)
          }

          // breakSessionFinishNotification();
          return prev;
        }
        return prev - 1;
      })
    }, 1000)
  }

  if (isTimerOn && isWorkTimeOn) {
    audioRef.current.pause()
  }

  const stopTimer = () => {
    if (workIntervalRef.current) {
      clearInterval(workIntervalRef.current);
      workIntervalRef.current = null;
    } else if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
      breakIntervalRef.current = null;
    }
  }

  // Handle timer state changes 
  useEffect(() => {
    if (isTimerOn /* && countSessions <= (numOfSessions + 1) */) {
      if (isWorkTimeOn) {
        workSession();
      } else if (!isWorkTimeOn) {
        breakSession();
      }
    } else {
      stopTimer()
    }
    return () => stopTimer() // clean up
    // if you put isWorkTimeOn in the dependency array , timer is not gonna stop after breakSession or workSession , as after the end of a breakSession or workSession the value of isWorkTimeOn changes between true or false leading to the rerender of the App component, 
  }, [isTimerOn,/* isWorkTimeOn */])


  function resetTimer() {
    stopTimer();
    setIsTimerOn(false);
    setIsWorkTimeOn(true);
    // setCountSessions(0);
    setSessionTimeLeft(sessionLength * 10);
    setBreakTimeLeft(breakLength * 10);
  }

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans p-4">
    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl px-8 py-15 border border-gray-700">
      {/* Timer Display */}
      <div className="flex items-center justify-center space-x-4 text-6xl font-bold mb-8">
        <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center shadow-inner">
          {minute.toString().padStart(2, '0')}
        </div>
        <div className="text-6xl">:</div>
        <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center shadow-inner">
          {second.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => {
            if (numOfSessions > 0 /* && countSessions < numOfSessions */) {
              setIsTimerOn((prev) => !prev);
            }
          }}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition font-semibold"
        >
          {isTimerOn ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            resetTimer();
            getAndSetToken();
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition font-semibold"
        >
          Reset
        </button>
      </div>

      {/* Audio Ref */}
      <Audio ref={audioRef} />

      {/* Settings: Sessions / Lengths */}
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 mt-4 place-content-center">
        {/* <NumOfSessions /> */}
        <SessionLength />
        <BreakLength />
      </div>
    </div>
  </div>
);

}


export default App;
