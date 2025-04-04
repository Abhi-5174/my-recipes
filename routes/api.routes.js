import express from "express";

const apiRouter = express.Router();

apiRouter.get("/recipes", async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page) || 1;
    const offset = (page - 1) * 9;
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&offset=${offset}&number=9`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: "Unable to fetch data from api!" });
    }
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default apiRouter;
