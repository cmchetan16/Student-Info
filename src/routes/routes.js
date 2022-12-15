const express = require("express");
const Router  = express()

const {createTeacher,login, updateTeacher}= require("../controllers/teacherController")
const {createStudent,getStudentData,updateStudent}= require("../controllers/studentController")
const {authentication}= require("../middleware/authentication")


Router.post("/test",(req,res)=>{
    
    res.send(req.body)
})

Router.post("/teacher/register", createTeacher)
Router.post("/teacher/login",login)
Router.put("/teacher/update/:teacherId",authentication,updateTeacher)


Router.post("/teacher/:teacherId/createStudent", authentication, createStudent)
Router.get("/teacher/:teacherId",authentication, getStudentData)
Router.put("/teacher/:teacherId/updateStudent/:studentId",authentication,updateStudent)

module.exports = Router