import { askAiPrescription } from "@/utils/AiModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const result = await askAiPrescription.sendMessage(prompt);
    if (result) {
      return NextResponse.json(result.response.text());
    }
    return { success: false, error: "Failed to generate prescription" };
  } catch (e) {
    console.log("Internal error: ", e);
    return {
      success: false,
      error: "Internal error occured while generating prescription",
    };
  }
}
