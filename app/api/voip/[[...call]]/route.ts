import { TCallQuery } from "@/types/TCallQuery";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest)
{
    /**
     * 1. Get receiver number in query params (for now. Many can be added in the future)
     * 3. Call twilio API to start the call
     * 4. Return response
     */

    const receiver_number = request.nextUrl.searchParams.get("receiver_number");

    // Step #1
    if (receiver_number == null)
    {
        return Response.json({
            error: "recepient number must not be null!",
            message: "Something went wrong, please try again."
        })
    }

    // Step #2
    const client = require('twilio')(process.env.NEXT_PUBLIC_TWILIO_SID_ID, process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN);

    const callQuery: TCallQuery = {
        url: "http://demo.twilio.com/docs/voice.xml",
        to: receiver_number,
        from: "+18506350069"
    }

    const response = client.calls.create(callQuery);

    // Step #3
    return response;
}