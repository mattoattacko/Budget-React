import { useState, useEffect } from "react"

// By default, we want to get the value from local storage. Otherwise fallback to a defaultValue.
export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue) // we have something in localstorage, lets use it.

    // we check if its a function because inside of useState, we can pass either a function or a value, so we need to take into account both scenarios
    if (typeof defaultValue === "function") {
      return defaultValue()
    } else {
      return defaultValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value]) //whenever our key or value change, we update our localStorage.

  return [value, setValue]
}