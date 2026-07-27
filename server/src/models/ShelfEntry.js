const { Schema, model } = require('mongoose');

// ShelfEntry is the join collection that expresses the User <-> Book
// many-to-many relationship: a User has many ShelfEntries, a ShelfEntry
// belongs to exactly one User and references exactly one Book.
const shelfEntrySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: {
      type: String,
      enum: ['want', 'reading', 'read'],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// A user can only shelve a given book once — re-shelving updates the
// existing entry (via PATCH) instead of creating a duplicate.
shelfEntrySchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = model('ShelfEntry', shelfEntrySchema);
