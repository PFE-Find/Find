// pages/api/search.js (or .ts if you're using TypeScript)
export async function handler(req, res) {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: "Invalid query parameter" });
    }
  
    try {
      // Your logic to fetch suggestions (e.g., Google Places API)
      const suggestions = await getSuggestionsFromAPI(query);
      return res.status(200).json(suggestions);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  }
  