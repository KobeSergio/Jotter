"use client"
import { useFirebase } from "@/contexts/FirebaseContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Messages()
{
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const { firebase } = useFirebase();
    const router = useRouter();

    const call = async () =>
    {
        const callId = await firebase.initializeCall("123", "321", phoneNumber!);

        router.push(`/call/${callId}`);
    }

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div className="bg-slate-600 p-10 rounded-full cursor-pointer" onClick={call}>
                <img src="/call.png" width={100} height={100} />
            </div>
            <input type="text" className="w-[500px] mt-10 py-2 px-5 border-slate-700 border-2" onChange={(e) => { setPhoneNumber(e.target.value) }} placeholder="Put the number you wanna call here" />
            <p className="mt-5 font-bold text-2xl">I&apos;m only one call away 🎵</p>
        </div>
    );
}