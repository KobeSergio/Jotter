"use client"
import { useFirebase } from "@/contexts/FirebaseContext";
import { TCallDetails } from "@/types/TCallDetails";
import { useEffect, useState } from "react";

export default function Call({ params }: { params: { call_id: string } })
{
    /**
     * 1. Get call_id from query (props)
     * 2. Get call details from firebase (after initializing a call)
     * 3. Check if call details exists
     * 4. Call twilio API using fetch
     */

    const { firebase } = useFirebase();
    const [callDetails, setCallDetails] = useState<TCallDetails>();
    const [callRespponce, setCallResponse] = useState<Response>();

    // Step #2
    useEffect(() =>
    {
        firebase.getCallDetails(params.call_id).then((response) =>
        {
            // Step #3
            if (response == undefined)
                throw new Error('Call details is undefined');

            setCallDetails(response);
        });
    }, [])

    useEffect(() =>
    {
        if (callDetails != undefined)
            call();

    }, [callDetails]);

    // Step #4
    function call()
    {
        const params = new URLSearchParams(callDetails)

        fetch(`/api/voip/call?${params}`).then((response) =>
        {
            setCallResponse(response);
            console.log(response);
        });
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">Calling {callDetails?.receiver_id}</p>
            <p className="text-lg text-slate-700">Raaawr!</p>
        </div>
    )
}