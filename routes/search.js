import { Router } from "express";
import universityData from '../data/search.js'
import validation from '../data/validation.js'
import {getUniversity} from '../data/universities.js'
const router = Router();

router
  .get("/", async (req, res) => {
    try
    {
        res.render("search");
    }
    catch (e)
    {
        res.status(500).json({ error: e });
    }
  })
  router.route('/searchresults').post(async (req, res) => {
    //code here for POST this is where your form will be submitting searchCharacterByName and then call your data function passing in the searchCharacterByName and then rendering the search results of up to 15 characters.
    try
    {
      const data = req.body;
  
      let search = validation.checkSearch(data.searchTerm)
    }
    catch (e)
    {
      res.status(400).render('error', {errorMessage: "Please provide a valid search term"})
    }

    try
  {
    let search = req.body.searchTerm
    search = search.trim()
    const data1 = await universityData.searchUniversity(search)
      if(data1.length == 0)
      {
        return res.status(404).render('error', {errorMessage1: "No results were found for " + search})
      }
      res.render("search-universities", {universitySearchResult: data1, search})
  }
  catch (e)
  {
    console.error(e)
    res.status(404).render('error',{errorMessage2: "Unable to gather character data"})
  }
  });
  
  
  router.route('/search-universities/:id').get(async (req, res) => {
    //code here for GET a single character
    try
    {
      let search = req.params.id
      search = validation.checkId(search)
    }
    catch (e)
    {
      res.status(400).render("error", {errorMessage: "Please provide a valid id"})
    }
    try
    {
      let search = req.params.id
      //search = validation.checkId(search)
      const data = await universityData.getId(search)
      if(data.length == 0)
      {
        
        return res.status(404).render("error", {errorMessage1: "We're sorry, but no results were found for " + search})
      }
      res.render("universitiesById", {universityById: data})
    }
    catch (e)
    {
      console.log(e)
      res.status(404).render("error",{errorMessage2: "Unable to gather character data"})
    }
  });
  
  export default router
  