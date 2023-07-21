// Helper Page to get rid of current cart stored locally

import { useEffect } from "react"

export default function DeleteLocal(){
    useEffect(()=>{
        localStorage.removeItem("cart")
    },[])
    return (
        <h1>Local Cart Deleted</h1>
    )
}