"use client"
import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export const CrispChat = () => {
    useEffect (()=>{
        Crisp.configure("8df3d70c-d383-4199-aaae-9818cee04c3c")

    },[]);
    return null;
}