import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage = {
  role: "system",
  content: "You are a code Generator. You must answer only in code snippets.",
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Authenticate the user
    const { userId } = auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    console.log("Received body:", body);

    if (!body.messages || !Array.isArray(body.messages)) {
      return new NextResponse("Messages array is required", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("You have reached the maximum limit", { status: 403 });
    }

    // Create a chat completion request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...body.messages],
    });
    // Increase the API usage count
    if (!isPro) {
       await incrementApiLimit();

    }
    

    // Return the response from OpenAI
    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.error("[CODE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
