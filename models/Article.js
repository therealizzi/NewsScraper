var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
// This is similar to a Sequelize model
var articleSchema = new Schema({
  // `name` must be unique and of type String
  title: {
    type: String,
    unique: true
  },

  excerpt: {
    type: String,
    unique: true
  },

  link: {
    type: String
  },

  // `notes` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Note model
  // This allows us to populate the Article with any associated Notes
  comments: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Comment model
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", articleSchema);

// Export the Article model
module.exports = Article;
