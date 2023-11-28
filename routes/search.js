import { Router } from "express";
import universityData from "../data/search.js";
import { getUniversity } from "../data/universities.js";
import { searchUniversitySchema } from "../data/validation.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    res.render("search");
  } catch (e) {
    res
      .status(500)
      .render("error", { errorMessage1: "Failed to render search page" });
  }
});
router.route("/search-universities").get(async (req, res) => {
  const { search } = req.query;
  const parseResults = searchUniversitySchema.safeParse(search);
  if (!parseResults.success) {
    return res
      .status(400)
      .render("error", { errorMessage: parseResults.error.issues[0].message });
  }
  try {
    const searchQuery = parseResults.data;
    const searchResults = await universityData.searchUniversity(searchQuery);
    if (searchResults.length == 0) {
      return res.status(404).render("error", {
        errorMessage1: "No results were found for " + searchQuery,
      });
    }
    res.render("search-universities", {
      universitySearchResult: searchResults,
      searchQuery,
    });
  } catch (e) {
    console.error(e);
    res
      .status(404)
      .render("error", { errorMessage2: "Unable to gather character data" });
  }
});

export default router;
