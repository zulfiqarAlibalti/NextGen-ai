import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit"; // Corrected import statement

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is set
});

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

    // Validate the messages array
    if (!body.messages || !Array.isArray(body.messages)) {
      return new NextResponse("Messages array is required", { status: 400 });
    }

    // Check if the user has not exceeded the free trial limit
    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("You have reached the maximum limit", { status: 403 });
    }

    // Create a chat completion request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages,
    });

    // Increase the API usage count
    await increaseApiLimit();

    // Return the response from OpenAI
    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
