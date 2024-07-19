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

    // Check if the prompt is provided and is an array
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
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: body.prompt,
        }
      }
    );
    // Increase the API usage count
    if (!isPro) {
    await incrementApiLimit();
    }
    // Return the response from Replicate
    return NextResponse.json(response);

  } catch (error) {
    console.error("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
