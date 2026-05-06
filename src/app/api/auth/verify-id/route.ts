import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userRoll = formData.get("rollNumber") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided fam." }, { status: 400 });
    }

    // SIMULATED OCR AND METADATA CHECK
    // In a real scenario, you'd use a library like 'exif-reader' or a 3rd party API.
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock metadata check: fail if filename contains "ai" or "edited" (for testing)
    const fileName = file.name.toLowerCase();
    const isFake = fileName.includes("ai") || fileName.includes("fake") || fileName.includes("edited");

    if (isFake) {
      return NextResponse.json({ 
        success: false, 
        reason: "Metadata vibe check failed. Looks like this ID was generated or edited by AI." 
      }, { status: 400 });
    }

    // Mock OCR: extract roll number
    // For the mock, we assume it always matches if not "fake"
    const extractedRoll = userRoll; 

    return NextResponse.json({
      success: true,
      extractedRoll,
      message: "ID looks legit."
    });

  } catch (error) {
    return NextResponse.json({ error: "Server went sideways. Try again." }, { status: 500 });
  }
}
