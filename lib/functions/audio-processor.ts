export async function audioProcessor(audioFile: File) {
  const formData = new FormData();
  formData.append("audioFile", audioFile);
  try {
    const response = await fetch("/api/process-audio", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Audio processing failed");

    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}

export function float32ArrayToWav(buffer: any, sampleRate: any) {
  const numChannels = 1;
  const numSamples = buffer.length;
  const format = 1; // PCM - integer samples
  const bitDepth = 16;

  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;

  const bufferArray = new ArrayBuffer(44 + dataSize);
  const view = new DataView(bufferArray);

  // Writing the WAV header
  writeString(view, 0, "RIFF"); // RIFF header
  view.setUint32(4, 36 + dataSize, true); // file length
  writeString(view, 8, "WAVE"); // WAVE header
  writeString(view, 12, "fmt "); // fmt chunk
  view.setUint32(16, 16, true); // length of fmt data
  view.setUint16(20, format, true); // format type
  view.setUint16(22, numChannels, true); // number of channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, byteRate, true); // byte rate
  view.setUint16(32, blockAlign, true); // block align
  view.setUint16(34, bitDepth, true); // bits per sample
  writeString(view, 36, "data"); // data chunk
  view.setUint32(40, dataSize, true); // data size

  // Converting Float32Array to PCM data
  floatTo16BitPCM(view, 44, buffer);

  return new Blob([view], { type: "audio/wav" });
}

export function writeString(view: any, offset: any, string: any) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function floatTo16BitPCM(output: any, offset: any, input: any) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

export async function transcribeSegment(segmentFile: any) {
  let formData = new FormData();
  formData.append("audioFile", segmentFile);

  try {
    const response = await fetch("/api/openai/", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.transcription || ""; // Return the transcription or an empty string if undefined
  } catch (err) {
    console.error("Error in transcribing segment:", err);
    return ""; // Return an empty string in case of an error
  }
}

export function splitAudioBuffer(audioBuffer: any, segmentDuration: any) {
  const sampleRate = audioBuffer.sampleRate;
  const durationInSeconds = audioBuffer.duration;
  const numberOfChannels = audioBuffer.numberOfChannels;

  const segmentLength = segmentDuration * sampleRate; // Segment length in samples
  const segments = [];

  for (let start = 0; start < audioBuffer.length; start += segmentLength) {
    const end = Math.min(start + segmentLength, audioBuffer.length);
    const segmentBuffer = audioBuffer.context.createBuffer(
      numberOfChannels,
      end - start,
      sampleRate
    );

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const audioBufferData = audioBuffer.getChannelData(channel);
      const segmentBufferData = segmentBuffer.getChannelData(channel);
      for (let i = start, j = 0; i < end; i++, j++) {
        segmentBufferData[j] = audioBufferData[i];
      }
    }

    segments.push(segmentBuffer);
  }

  return segments;
}
