import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const formData = await request.formData();
  const audioFileURL = formData.get("audioFileURL"); // URL to the audio file
  const audioFileName = formData.get("audioFileName"); // Name of the audio file
  const audioFileType = formData.get("audioFileType"); // Name of the audio file

  // Download the audio file
  const audioBlob = await fetch(audioFileURL as string).then((res) =>
    res.blob()
  );

  // Convert Blob to File. You might want to give a more meaningful name and ascertain the correct MIME type
  const audioFile = new File([audioBlob], `${audioFileName}`, {
    type: audioFileType as string,
    lastModified: new Date().getTime(),
  });

  console.log(audioFile);

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    response_format: "text",
  });

  return new Response(JSON.stringify({ transcription }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
