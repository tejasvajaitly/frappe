import { useState, useEffect, use } from 'react'
function useDebounce(value: any, delay: number): any {
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debounceValue
}

export default useDebounce
