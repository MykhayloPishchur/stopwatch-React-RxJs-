import React, { useState, useEffect } from 'react';
import { interval, fromEvent } from 'rxjs';
import {
  debounceTime,
  map,
  scan,
  buffer,
  startWith,
  share,
  filter,
} from 'rxjs/operators';
import './App.css';

function App() {
  const [time, setTime] = useState(0);
  const [pause, setPause] = useState(true);
  let timer$ = interval(1000);

  useEffect(() => {
    let startCount;

    startCount = timer$
      .pipe(
        startWith(time),
        scan(time => time + 1),
        share(),
      )
      .subscribe(i => {
        if (!pause) {
          setTime(i);
        }
      });

    return () => startCount.unsubscribe();
  }, [pause, time, timer$]);

  const handleStart = () => {
    setPause(false);
  };

  const handleStop = () => {
    setPause(true);
    setTime(0);
  };

  const handleReset = () => {
    setPause(false);
    setTime(0);
  };

  const handleWait = e => {
    const click$ = fromEvent(e.target, e.type);
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map(clicks => clicks.length),
      filter(clicksLength => clicksLength >= 2),
    );
    doubleClick$.subscribe(() => {
      console.log('Double Click!!!');
      setPause(true);
    });
  };

  const toHHMMSS = time => {
    return new Date(time * 1000).toISOString().substr(11, 8);
  };
  // console.log(time);
  return (
    <>
      <div className="wrapper">
        <h1>Stopwatch</h1>
        <h2>Using React.JS + RxJs</h2>
        <span>{toHHMMSS(time)}</span>
        <br></br>

        {pause && <button onClick={handleStart}>Start</button>}
        {!pause && <button onClick={handleStop}>Stop</button>}
        {!pause && time > 0 && <button onClick={handleWait}>Wait</button>}
        {time > 0 && <button onClick={handleReset}>Reset</button>}
      </div>
    </>
  );
}

export default App;
