import { Router } from "express";
import universityData from "../data/search.js";
import validation from "../data/validation.js";
import { getUniversity } from "../data/universities.js";
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
router.route("/searchresults").post(async (req, res) => {
  try {
    const data = req.body;

    let search = validation.checkSearch(data.searchTerm);
  } catch (e) {
    res
      .status(400)
      .render("error", { errorMessage: "Please provide a valid search term" });
  }

  try {
    let search = req.body.searchTerm;
    search = search.trim();
    const searchResults = await universityData.searchUniversity(search);
    if (searchResults.length == 0) {
      return res.status(404).render("error", {
        errorMessage1: "No results were found for " + search,
      });
    }
    res.render("search-universities", {
      universitySearchResult: searchResults,
      search,
    });
  } catch (e) {
    console.error(e);
    res
      .status(404)
      .render("error", { errorMessage2: "Unable to gather character data" });
  }
});

router.route("/search-universities/:id").get(async (req, res) => {
  try {
    let search = req.params.id;
    search = validation.checkId(search);
  } catch (e) {
    res
      .status(400)
      .render("error", { errorMessage: "Please provide a valid id" });
  }
  try {
    let search = req.params.id;
    const data = await getUniversity(search);
    if (data.length == 0) {
      return res.status(404).render("error", {
        errorMessage1: "We're sorry, but no results were found for " + search,
      });
    }
    res.render("universities-by-id", { university: data });
  } catch (e) {
    console.log(e);
    res
      .status(404)
      .render("error", { errorMessage2: "Unable to gather character data" });
  }
});

export default router;
