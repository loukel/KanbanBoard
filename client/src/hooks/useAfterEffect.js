import { useRef, useEffect } from 'react'

/**
 *  After first render hook.
 * `useAfterEffect` will only run after the first render, this differs to useEffect by skipping the first the useEffect call.
 * @param {Function} callback The callback to run after the first render
 * @param {Array} props Array of props to watch
*/
export const useAfterEffect = (callback, props = null) => {
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    callback()
  }, props)
}