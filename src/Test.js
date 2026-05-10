import { useState } from "react";

function SlowComponent() {
  // If this is too slow on your maching, reduce the `length`
  const words = Array.from({ length: 1000 }, () => "WORD");

  const allWords = words.map((word, i) => (
    <li key={i}>
      {i}: {word}
    </li>
  ));

  return <ul>{allWords}</ul>;
}

function Counter({ children }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Slow counter?!?</h1>

      <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
      {children}
    </>
  );
}
// performance optimization
// pass SlowComponent as prop children for make it not re-render when update state 
 
export default function Test() {
  return (
    <div>
      <Counter>
        <SlowComponent />
      </Counter>
    </div>
  );
}
