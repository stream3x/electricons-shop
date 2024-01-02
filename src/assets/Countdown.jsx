import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const calculateTimeLeft = (targetDate) => {
  const now = new Date().getTime();
  const timeLeft = targetDate - now;

  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0")
  };
};

export default function Countdown() {
  const targetDate = new Date(2023, 11, 31, 23, 59, 59).getTime();
  const [time, setTime] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime(calculateTimeLeft(targetDate));
    }, 1000);
  
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }

  }, []);

  return (
    <Typography id="timer">
      <Typography component="span">{time.hours}</Typography>:<Typography component="span">{time.minutes}</Typography>:<Typography component="span">{time.seconds}</Typography>
    </Typography>
  )
}
