const teacherModel = require("../models/teacherModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { validString, trimLower, validYear, validEmail, validPwd, isValidObjectId } = require("../utils/validators")

const createTeacher = async (req, res) => {
    try {

        const data = req.body

        if (!data) return res.status(400).send({ status: false, message: "provide some data" })
        let { fname, lname, grade, email, password, year } = data

        if (!fname) res.status(400).send({ status: false, message: "provide the frist name" })
        data.fname = trimLower(fname)
        if (!validString(data.fname)) res.status(400).send({ status: false, message: "provide valid frist name" })


        if (!lname) res.status(400).send({ status: false, message: "provide the last name" })
        data.lname = trimLower(lname)
        if (!validString(data.lname)) res.status(400).send({ status: false, message: "provide valid last name" })


        if (!grade) res.status(400).send({ status: false, message: "provide the grade" })
        data.grade = grade

        if (!year) res.status(400).send({ status: false, message: "provide the year" })
        data.year = year.trim()
        if (!validYear(data.year)) res.status(400).send({ status: false, message: "provide valid year" })

        if (!email) res.status(400).send({ status: false, message: "provide the email" })
        data.email = trimLower(email)
        if (!validEmail(data.email)) res.status(400).send({ status: false, message: "provide valid email" })
        const findEmail = await teacherModel.findOne({ email: email })
        if (findEmail) return res.status(400).send({ status: false, message: "try another email" })

        if (!password) res.status(400).send({ status: false, message: "provide the password" })
        data.password = password.trim()
        if (!validPwd(data.password)) res.status(400).send({ status: false, message: "password must contain at least 6 char, 1 spcial char, 1 num, 1 capital letter" })
        data.password = await bcrypt.hash(data.password, 10)

        const teacheData = await teacherModel.create(data)

        res.status(201).send({ status: true, message: "Your data is created", data: teacheData })

    } catch (error) {
        res.status(500).send({ meassage: error })
    }
}


const login = async (req, res) => {
    try {
        const data = req.body
        if (!data) return res.status(400).send({ status: false, message: "provide some data" })
        let { email, password } = data

        if (!email) return res.status(400).send({ status: false, message: "provide the email" })
        data.email = trimLower(email)
        if (!validEmail(data.email)) res.status(400).send({ status: false, message: "provide valid email" })


        if (!password) return res.status(400).send({ status: false, message: "provide the password" })
        data.password = password.trim()

        const findteacher = await teacherModel.findOne( {email : data.email}).select({ _id: 1, email: 1, password: 1 }).lean()

        if (!findteacher) return res.status(404).send({ status: false, message: "incorrect email or password" })

        let actualPassword = await bcrypt.compare(data.password, findteacher.password)

        if (!actualPassword) return res.status(400).send({ status: false, msg: "Incorrect email or password" })

        let token = jwt.sign({ teacherId: findteacher._id }, process.env.TOKEN_KEY, {
            expiresIn: "2d",
        })

        res.setHeader('Authorization', `Bearer ${token}`)

        return res.status(200).send({
            status: true, message: "login successfully",
            data: { teacherId: findteacher._id, token: token },
        })

    } catch (error) {
        res.status(500).send({ meassage: error })
    }
}

const updateTeacher = async (req, res) => {
    try {
        const teacherId = req.params.teacherId
        const data = req.body

        if(!isValidObjectId(teacherId))return res.status(400).send({ status: false, message: "login again" })

        const decodedToken = req.verifyed

        if(decodedToken.teacherId != teacherId)return res.status(403).send({ status: false, message: "login again" })



        if (!data) return res.status(400).send({ status: false, message: "provide some data" })

        let { fname, lname, grade, email, password, year } = data

        if (fname) {
            data.fname = trimLower(fname)
            if (!validString(data.fname)) res.status(400).send({ status: false, message: "provide valid frist name" })

        }

        if (lname) {
            data.lname = trimLower(lname)
            if (!validString(data.lname)) res.status(400).send({ status: false, message: "provide valid last name" })
        }

        if (grade) {


        }

        if (year) {
            data.year = year.trim()
            if (!validYear(data.year)) res.status(400).send({ status: false, message: "provide valid year" })
        }
        
        if (email) {
            data.email = trimLower(email)
            if (!validEmail(data.email)) return res.status(400).send({ status: false, message: "provide valid email" })
            const findEmail = await teacherModel.findOne({ email: email })
            if (findEmail) return res.status(400).send({ status: false, message: "try another email" })
        }

        if (password) {
            data.password = password.trim()
            if (!validPwd(data.password)) res.status(400).send({ status: false, message: "password must contain at least 6 char, 1 spcial char, 1 num, 1 capital letter" })
            data.password = await bcrypt.hash(data.password, 10)

        }

        const updateData = await teacherModel.findByIdAndUpdate(teacherId, data, {new : true}).lean()

        res.status(200).send({
            status: true,
            message: "data Updated successfully",
            data: updateData,
        })

    } catch (error) {
        res.status(500).send({ meassage: error })
    }
}

module.exports ={createTeacher,login, updateTeacher}