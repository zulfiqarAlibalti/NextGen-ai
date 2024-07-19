import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    const { prompt, amount = 1, resolution = "512x512" } = body;

    // Validate the request body
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    if (isNaN(amount) || amount <= 0) {
      return new NextResponse("Amount must be a positive number", { status: 400 });
    }
    if (!resolution.match(/^\d+x\d+$/)) {
      return new NextResponse("Resolution must be in the format WIDTHxHEIGHT", { status: 400 });
    }

    // Check API limits and subscription status
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("You have reached the maximum limit", { status: 403 });
    }

    // Create an image generation request to OpenAI
    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    // Increase the API usage count
    if (!isPro) {
      await incrementApiLimit();
    }

    // Return the image URLs
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}