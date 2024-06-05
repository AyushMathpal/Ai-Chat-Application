import React, { useEffect, useState } from 'react'

export function useDebouce<T>(value:T,delay?:number):T {
  const [debounceValue,setdebounceValue]=useState<T>(value);
  useEffect(() => {
    const timer=setTimeout(()=>setdebounceValue(value),delay||500)
    return ()=>{clearTimeout(timer)}
  }, [value,delay])
  
 return debounceValue

}
