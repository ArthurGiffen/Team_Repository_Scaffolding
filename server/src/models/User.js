const { Schema, model } = require('mongoose');

// User — one document per registered reader.
// passwordHash is a bcrypt hash; the plaintext password is never stored.
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = model('User', userSchema);
