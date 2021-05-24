const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "A message must have text."],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for display date
messageSchema.virtual("dateCreated_format").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  );
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
