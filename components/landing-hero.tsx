"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import TypewriterComponent from "typewriter-effect";
import  Link  from "next/link";

export const LandingHero = () => {
    const { isSignedIn } = useAuth();
    return (
        <div className="text-black font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>
                    The AI Tools for
                </h1>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                    <TypewriterComponent
                        options={{
                            strings: [
                                "Next Chat Gen AI",
                                "Next Image Gen AI",
                                "Next Code Gen AI",
                                "Next Video Gen AI",
                                "Next Music Gen AI",
                            ],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-700">
                Create content with 10x faster with Next Gen-AI 

            </div>
            <div>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"} >
                <Button variant="premium" className="md:text-lg p-4 md:p-6
                rounded-full font-semibold">
                    Start Generating For Free


                </Button>
                </Link>
                
            </div>
            <div className="text-zinc-500 text-xs md:text-sm font-normal">
                No credit card required.

            </div>
        </div>
    );
};
