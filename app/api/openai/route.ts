import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const formData = await request.formData();
  const audioFile = formData.get("audioFile");

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile as File,
    model: "whisper-1",
    response_format: "text",
  });

  return Response.json({ transcription });
}
