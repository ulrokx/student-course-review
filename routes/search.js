import { Router } from "express";
import { searchUniversitySchema } from "../data/validation.js";
import { searchUniversity } from "../data/search.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    res.render("index");
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
    const searchResults = await searchUniversity(searchQuery);
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
      .render("error", { errorMessage2: "Unable to gather university data" });
  }
});

export default router;
