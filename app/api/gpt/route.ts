import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const formData = await request.formData();
  const audioTranscript = formData.get("transcript");

  const assistantId = "asst_9nefdUGeht4o0tAIY4QXNkXR";

  //Create new thread with the message as the audio transcript
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: audioTranscript as string,
      },
    ],
  });

  //Run the thread with the assistant predefined on the backend
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
  });

  //Wait for run to complete
  let runComplete = false;
  let seconds = 0;
  while (!runComplete) {
    const isStillRunning = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    if (isStillRunning.status === "completed") {
      runComplete = true;
    }
    //Wait 1 second before checking again
    await new Promise((resolve) => setTimeout(resolve, 1000));
    seconds++;
  }

  //Get the data of the thread
  const data: any = await openai.beta.threads.messages.list(thread.id);

  const summary = data.data[0].content[0].text.value;

  return Response.json({ summary });
}
