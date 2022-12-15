const mongoose = require("mongoose")

const validString = (value) => {
    return /^[a-zA-Z]{3,20}$/.test(value)
}

const trimLower = (value) => {
    return value.trim().toLowerCase()
}


const validYear = (value) => {
    return /^[0-9]{4,4}$/.test(value)
}


const validEmail = (value) => {
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value)
}

const validPwd = (value) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(value)
}

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value)
}
//console.log(validObjectId("alskdjflkasdfljlkasjdlf"))

const validSubject = (value) => {
    return /^[a-z0-9 ]{3,20}$/.test(value)
}

const validMarks = (value) => {
    return /^[0-9]{1,4}$/.test(value)
}

const validRollNo = (value) => {
    return /^[0-9]{1,3}$/.test(value)
}
console.log(validRollNo(40))

module.exports = { validString, trimLower, validYear, validEmail, validPwd, isValidObjectId, validSubject, validMarks, validRollNo }