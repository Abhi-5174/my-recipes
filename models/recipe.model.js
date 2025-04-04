import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  aisle: { type: String },
  amount: { type: Number },
  consistency: { type: String },
  id: { type: Number },
  image: { type: String },
  measures: {
    metric: {
      amount: { type: Number },
      unitLong: { type: String },
      unitShort: { type: String },
    },
    us: {
      amount: { type: Number },
      unitLong: { type: String },
      unitShort: { type: String },
    },
  },
  meta: { type: [String] },
  name: { type: String },
  original: { type: String },
  originalName: { type: String },
  unit: { type: String },
});

const recipeSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String },
  servings: { type: Number },
  readyInMinutes: { type: Number },
  cookingMinutes: { type: Number },
  preparationMinutes: { type: Number },
  sourceName: { type: String },
  sourceUrl: { type: String },
  healthScore: { type: Number },
  spoonacularScore: { type: Number },
  pricePerServing: { type: Number },
  instructions: { type: String },
  cuisines: { type: [String] },
  diets: { type: [String] },
  dishTypes: { type: [String] },
  extendedIngredients: [ingredientSchema],
  summary: { type: String },
  winePairing: {
    pairedWines: { type: [String] },
    pairingText: { type: String },
    productMatches: [
      {
        id: { type: Number },
        title: { type: String },
        description: { type: String },
        price: { type: String },
        imageUrl: { type: String },
        averageRating: { type: Number },
        ratingCount: { type: Number },
        score: { type: Number },
        link: { type: String },
      },
    ],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
