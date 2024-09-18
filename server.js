const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

mongoose.connection.on("error", (err)=> {
    console.log(err);
})

const Movie = require("./models/movie");

app.set("view engine", "ejs");

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("index");
});

//New Route

app.get("/movies/new", (req, res) => {
  res.render("movies/new");
});

//Show Route

app.get("/movies/:id", async (req, res) => {
  try {
    const foundFruit = await Movie.findById(req.params.id);
    const contextData = { movie: foundMovie };
    res.render("movies/show", contextData);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get('/movies', async (req,res)=>{
    try {
        const allMovies= await Movie.find()
res.render( "movies/index",  { movies: allMovies, message: "HEY " })
} catch(err){
    console.log(err);
    res.redirect('/');
}
});

//POST!

app.post("/movies", async (req,res)=>{
if (req.body.isReadyToWatch) {
    req.body.isReadyToWatch = true;
  } else {
    req.body.isReadyToWatch = false;
  }

  try {
    await Movie.create(req.body);
    res.redirect("/movies/new?status=success");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

});

//DELETE!

app.delete('/movies/:id', async (req,res)=>{
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id)
        console.log(deletedMovie, "response from db after deletion")
        res.redirect('/movies')
    } catch(err){
        console.log(err)
        res.redirect(`/`)
    }
   });

  //EDIT!

  app.get("/movies/:movieId/edit", async (req,res) => {
    try {
      const movieToEdit = await Movie.findById(req.params.movieId);
      res.render("movies/edit", { movie: movieToEdit });
    } catch (err) {
      console.log(err);
      res.redirect(`/`);
    }
  });
  
  //UPDATE!

  app.put("/movies/:id", async (req, res) => {
    try {
  
      if (req.body.isReadyToWatch === "on") {
        req.body.isReadyToWatch = true;
      } else {
        req.body.isReadyToWatch = false;
      }
  
      await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });

      res.redirect(`/movies/${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.redirect(`/movies/${req.params.id}`);
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  
