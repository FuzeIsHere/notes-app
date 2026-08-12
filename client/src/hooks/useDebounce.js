import { useEffect } from "react";
import { useRef } from "react";

export const useDebounce = (delay) => {
    const timeout = useRef(null)
    const x = (action) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            action()
        }, delay ? delay : 500)
    }
    
    useEffect(() => {
        return () => {
            clearTimeout(timeout.current)
        }
    }, [])
    return x
}