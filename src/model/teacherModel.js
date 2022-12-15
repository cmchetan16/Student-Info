const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema(
    {
        fname: { type: String, require: true, trim: true },
        lname: { type: String, require: true, trim: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        year: { type: Number, require: true },
        grade: { type: String, require: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);