import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Invalid query parameter" }, { status: 400 });
    }

    try {
        const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(regions)&key=${googlePlacesApiKey}`
        );

        const data = await response.json();

        if (data.status !== "OK") {
            console.error('Google API error:', data.status, data.error_message);  // Log API error
            return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
        }

        const suggestions = data.predictions.map((prediction: any) => prediction.description);

        // ✅ Set CORS Headers
        const headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });

        return new NextResponse(JSON.stringify(suggestions), { headers });
    } catch (error) {
        console.error("Error fetching data from Google Places API:", error);  // Log the error
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
