import { useState, useEffect, useRef } from 'react'
import { useAuth } from './Root';
import NumOfSessions from './NumOfSessions.jsx';
import SessionLength from './SessionLength.jsx';
import BreakLength from './BreakLength.jsx';
import Audio from './Audio.jsx'
// import { subscribeUser } from './SubscribeUser.js';
import axios from 'axios';

function App() {

  const { breakLength, sessionLength, setSessionLength, setBreakLength, setNumOfSessions, numOfSessions, sessionTimeLeft, setSessionTimeLeft, breakTimeLeft, setBreakTimeLeft, isTimerOn, setIsTimerOn, session, getAndSetToken, sendNotifications } = useAuth();

  const [isWorkTimeOn, setIsWorkTimeOn] = useState(true);
  // const [isBreakTimeOn, setIsBreakTimeOn] = useState(false);
  const [countSessions, setCountSessions] = useState(0);
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
          session(sessionLength);
          sendNotifications("pomodoro", "dead people eat other dead people..");
          setSessionTimeLeft(sessionLength * 10);
          setCountSessions((prev) => prev + 1)

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
          sendNotifications("pomodoro", "dead people do not come back..!!")
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
    if (isTimerOn && countSessions <= (numOfSessions + 1)) {
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
    setCountSessions(0);
    setSessionTimeLeft(sessionLength * 10);
    setBreakTimeLeft(breakLength * 10);
  }

  return (
    <>
      <div>
        {console.log("sessionLength", sessionLength)}
        <div>{`${minute}:${second}`}</div>
        <button onClick={() => {
          if (numOfSessions > 0 && countSessions < numOfSessions) {
            setIsTimerOn((prev) => !prev)
          }
        }}>{isTimerOn ? <span>pause</span> : <span>start</span>}</button>
        <button onClick={() => {
          resetTimer();
          getAndSetToken();
          // subscribeUser()
        }}>Reset</button>

        {/*  <button onClick={subscribeUser}>Subscribe</button>
        <button onClick={sendNotification}>send notification</button> */}

        <Audio ref={audioRef} />
        <NumOfSessions />
        <SessionLength />
        <BreakLength />

      </div>
    </>
  )
}


export default App
