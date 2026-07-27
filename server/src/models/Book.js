const { Schema, model } = require('mongoose');

// Book — cached locally the first time any user shelves it, so a user's
// shelves don't depend on a live Open Library call afterward (per proposal).
const bookSchema = new Schema(
  {
    olKey: { type: String, required: true, unique: true }, // Open Library work id, e.g. "/works/OL45804W"
    title: { type: String, required: true },
    author: { type: String },
    firstPublishYear: { type: Number },
    coverId: { type: Number },
  },
  { timestamps: true }
);

module.exports = model('Book', bookSchema);
