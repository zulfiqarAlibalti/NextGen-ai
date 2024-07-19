import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
// Initialize Replicate with the API key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
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

    // Check if the prompt is provided and is a string
    if (!body.prompt || typeof body.prompt !== 'string') {
      return new NextResponse("Prompt is required and must be a string", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("You have reached the maximum limit", { status: 403 });
    }

    // Call the replicate API with the prompt
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", 
      { input: { prompt: body.prompt } }
    );
    // Increase the API usage count
    if (!isPro) {
    await incrementApiLimit();
    }

    // Return the response from Replicate
    return NextResponse.json(response);

  } catch (error) {
    console.error("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
