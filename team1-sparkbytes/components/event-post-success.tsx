"use client";

import {useEffect, useState} from "react";
import Confetti from "react-confetti";
import {useRouter} from "next/navigation";

export default function EventPostSuccess() {
    const router = useRouter();
    const [windowSize, setWindowSize] = useState({width: 0, height: 0});
    
    useEffect(() => {
        setWindowSize({width: window.innerWidth, height: window.innerHeight});
    }, []);

    useEffect(()=>{
        const timer=setTimeout(()=>{
            router.push("/events");
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);
    
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
            <Confetti width={windowSize.width} height={windowSize.height} />
            <h1 className="text-4xl font-semibold mb-4">
                🎉 Event Successfuly Posted! 🎉
            </h1>
            <p className="text-lg text-gray-700">
                Redirecting you to the events page...
            </p>
        </div>
    );
}