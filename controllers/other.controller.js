const searchRecipe = async (req, res) => {
  try {
    let { query, category, sortBy } = req.query;
    console.log(query, category, sortBy);
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}`;

    if (query) url += `&query=${query}`;

    if (category && category !== "") url += `&type=${category}`;

    if (sortBy) {
      url += `&sort=${sortBy}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: "Unable to fetch data!" });
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.json({ results: [], message: "No recipes found" });
    }

    res.status(200).json({ results: data.results });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

export { searchRecipe };
