---
title: 'Getting Started with React Hooks'
excerpt: 'React Hooks basics—useState, useEffect, useMemo, useCallback, and a custom hook—with corrected examples from day-to-day component work.'
publishDate: '2025-09-04'
tags: ['react', 'javascript', 'frontend-development', 'web-development']
---

# Getting started with React Hooks

Hooks landed in React 16.8 and changed how I write components. I rarely create class components anymore—`useState` and `useEffect` cover most cases, and custom hooks let me extract logic I used to duplicate across files.

This post covers the hooks I reach for daily, with examples that reflect how they actually work.

## useState

Adds local state to function components:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Clicked {count} times</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

Use the functional updater (`setCount(c => c + 1)`) when the new state depends on the previous value—especially inside callbacks that close over stale state.

## useEffect

Runs side effects after render—data fetching, subscriptions, DOM sync:

```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []); // empty deps = run once on mount

  return <p>{seconds}s elapsed</p>;
}
```

The dependency array controls when the effect re-runs. Omit it and the effect runs after every render; include values the effect reads so ESLint's `exhaustive-deps` rule can catch stale closures.

## useContext

Reads a context value without wrapping components in `<Consumer>`:

```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Themed button</button>;
}
```

For app-wide state that changes often, Context alone can cause broad re-renders. Pair it with `useReducer`, or reach for a dedicated state library when complexity grows.

## useReducer

Better when state transitions are multi-field or event-driven:

```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

## useMemo and useCallback

These optimize referential stability—not magic performance fixes.

- **`useMemo`** caches a **computed value** between renders.
- **`useCallback`** caches a **function reference** between renders.

Use them when passing values to memoized children (`React.memo`) or as dependencies of other hooks—not on every computation.

```jsx
import { useState, useMemo, useCallback, memo } from 'react';

const ExpensiveDisplay = memo(function ExpensiveDisplay({ value }) {
  return <p>Result: {value}</p>;
});

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Recompute only when count changes
  const doubled = useMemo(() => count * 2, [count]);

  // Stable function reference for memoized children
  const increment = useCallback(() => setCount(c => c + 1), []);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveDisplay value={doubled} />
      <button onClick={increment}>Increment ({count})</button>
    </div>
  );
}
```

The common mistake is wrapping a function in `useMemo` (returns a function, but `useCallback` is the right tool) or memoizing cheap operations that cost more to cache than to recompute.

## Custom hooks

Extract reusable stateful logic into functions that call hooks. By convention, names start with `use`.

A `useFetch` hook I reuse across projects:

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (!cancelled) setData(json);
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data, loading, error } = useFetch('/api/users');

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {data.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

Custom hooks share logic without changing the component tree—unlike render props or HOCs. Rules of Hooks still apply: only call hooks at the top level of a React function or another custom hook.

## Rules of Hooks (quick reference)

1. Call hooks only at the top level—no loops, conditions, or nested functions.
2. Call hooks only from React function components or custom hooks.

The ESLint plugin `eslint-plugin-react-hooks` enforces these in most setups.

## Summary

`useState` and `useEffect` handle the majority of component logic. Reach for `useReducer` when transitions get complex, `useMemo`/`useCallback` when referential stability matters for memoized children, and custom hooks when you spot duplicated effect or state patterns across files.
