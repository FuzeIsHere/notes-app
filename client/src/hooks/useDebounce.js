import { useRef } from "react";

export const useDebounce = (delay) => {

    const timeout = useRef(null)
    const x = (action) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            action()
        }, delay)
    }
    return x
}