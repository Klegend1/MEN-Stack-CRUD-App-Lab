//models/movies

const mongoose = require('mongoose')

const moviesSchema = new mongoose.Schema({
    name: String, 
    genre: String,
    isReadyToWatch: Boolean,
})
  
  const Movies = mongoose.model('Movies', moviesSchema)
  module.exports = Movies



