import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
  minutes: number,
  seconds: number,
  hasFinished: boolean,
  isActive: boolean,
  startCountdown: ()=> void,
  resetCountdown: ()=> void
}

interface CountdownProviderProps {
  children: ReactNode
}

let countDownTimeout: NodeJS.Timeout

export const CountdownContext = createContext({} as CountdownContextData)

export function CountdownProvider({ children }: CountdownProviderProps) {
  const MAX_TIME = 0.2*60

  const { startNewChallenge } = useContext(ChallengesContext)

  const [time, setTime] = useState(MAX_TIME)
  const [isActive, setActive] = useState(false)
  const [hasFinished, setFinished] = useState(false)

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  function startCountdown() {
    setActive(true)
  }

  function resetCountdown() {
    clearTimeout(countDownTimeout)
    setActive(false)
    setTime(MAX_TIME)
    setFinished(false)
  }

  useEffect(() => {
    if(isActive && time > 0) {
      countDownTimeout = setTimeout(() => {
        setTime(time -1)
      }, 1000)
    } else if( isActive && time == 0 ) {
      setFinished(true)
      setActive(false)
      startNewChallenge()
    }
  }, [isActive, time])

  
  return(
    <CountdownContext.Provider value={
      {
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown
      }
    } >
      { children }
    </CountdownContext.Provider>
  )
}