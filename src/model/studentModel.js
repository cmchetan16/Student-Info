const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema(
    {
        fname: { type: String, require: true, trim: true },
        lname: { type: String, require: true, trim: true },
        subject: { type: Object },
       
        rollNo: { type: String, required: true },
        teacherId: { type: ObjectId, ref: "Teacher", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);