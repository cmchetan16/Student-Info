const studentModel = require("../models/studentModel")
const { validString, trimLower, isValidObjectId, validSubject, validMarks, validRollNo } = require("../utils/validators")


const createStudent = async (req, res) => {
    try {

        const teacherId = req.params.teacherId
        const data = req.body

        if (!isValidObjectId(teacherId)) return res.status(400).send({ status: false, message: "login again" })

        const decodedToken = req.verifyed

        if (decodedToken.teacherId != teacherId) return res.status(403).send({ status: false, message: "login again" })


        if (!data) return res.status(400).send({ status: false, message: "provide some data" })
        let { fname, lname, subject, marks, rollNo } = data

        if (!fname) res.status(400).send({ status: false, message: "provide the frist name" })
        data.fname = trimLower(fname)
        if (!validString(data.fname)) res.status(400).send({ status: false, message: "provide valid frist name" })

        if (!lname) res.status(400).send({ status: false, message: "provide the last name" })
        data.lname = trimLower(lname)
        if (!validString(data.lname)) res.status(400).send({ status: false, message: "provide valid last name" })

        if (!rollNo) res.status(400).send({ status: false, message: "provide the roll no" })
        data.rollNo = rollNo.toString().trim()
        if (!validRollNo(data.rollNo)) return res.status(400).send({ status: false, message: "provide valid roll no" })
        const findRollNo = await studentModel.findOne({ rollNo: data.rollNo, teacherId: teacherId })
        if (findRollNo) return res.status(400).send({ status: false, message: "this roll no alredy in use" })

        if (subject) {
            subject = trimLower(subject)

            if (!validSubject(subject)) res.status(400).send({ status: false, message: "provide valid subject" })

        }

        if (marks) {

            if (!data.subject) return res.status(400).send({ status: false, message: "provide the subject" })
            marks = marks * 1
            if (!validMarks(marks)) return res.status(400).send({ status: false, message: "provide valid marks" })

        }

        data.teacherId = teacherId

        data.subject = {}
        data.subject[subject] = marks

        const newStudent = await studentModel.create(data)

        res.status(201).send({ status: true, message: "Student is created", data: newStudent })

    } catch (error) {
        res.status(500).send({ meassage: error })
    }
}

const getStudentData = async (req, res) => {

    try {
        const teacherId = req.params.teacherId
        const sudentData = await studentModel.find({ teacherId: teacherId })
        res.status(200).send({ status: true, data: sudentData })

    } catch (error) {
        res.status(500).send({ meassage: error })
    }

}

const updateStudent = async (req, res) => {
    try {

        const teacherId = req.params.teacherId
        const studentId = req.params.studentId
        const data = req.body

        if (!isValidObjectId(teacherId)) return res.status(400).send({ status: false, message: "login again" })

        const decodedToken = req.verifyed

        if (decodedToken.teacherId != teacherId) return res.status(403).send({ status: false, message: "login again" })


        if (!data) return res.status(400).send({ status: false, message: "provide some data" })

        let { fname, lname, subject, marks, rollNo } = data

        if (fname) {
            data.fname = trimLower(fname)
            if (!validString(data.fname)) res.status(400).send({ status: false, message: "provide valid frist name" })


        }

        if (lname) {
            data.lname = trimLower(lname)
            if (!validString(data.lname)) res.status(400).send({ status: false, message: "provide valid last name" })
        }

        if (rollNo) {
            data.rollNo = rollNo.toString().trim()

            if (!validRollNo(data.rollNo)) res.status(400).send({ status: false, message: "provide valid roll no" })
            const findRollNo = await studentModel.findOne({ rollNo: data.rollNo, teacherId: teacherId })
            if (findRollNo) return res.status(400).send({ status: false, message: "this roll no alredy in use" })

        }
        if (subject) {
            subject = trimLower(subject)
            if (!validSubject(subject)) res.status(400).send({ status: false, message: "provide valid subject" })


        }

        if (marks) {

            if (!data.subject) return res.status(400).send({ status: false, message: "provide the subject" })
            marks = marks * 1
            if (!validMarks(marks)) return res.status(400).send({ status: false, message: "provide valid marks" })

        }
        const findSubject = await studentModel.findById(studentId).lean()
        for (let sub in findSubject.subject) {
            if (sub == subject) {
                findSubject.subject[sub] += marks
            }
        }
        if (findSubject.subject[subject] == undefined) {
            findSubject.subject[subject] = marks
        }
        data.subject = findSubject.subject


        const updateStudentData = await studentModel.findByIdAndUpdate(studentId, data, { new: true })
        res.status(200).send({ status: true, message: "data updated", data: updateStudentData })

    } catch (error) {
        res.status(500).send({ meassage: error })
    }
}

module.exports = { createStudent, getStudentData, updateStudent }