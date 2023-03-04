const loginsModel = require('../Models/loginsmodel')
const bcrypt = require('bcrypt')
const DataCheck = require('../Models/functions')


/**
 * These Controller require certain functions to perform checks on data
 * they are in Model/functions
 */
exports.signup = async (req, res, next) => {

    console.log("Entering signup")
    const emailCheck = await DataCheck.usernameCheck(req.body.emailAdress)
    console.log("email check is", emailCheck)
    if (emailCheck == true) {
        console.log("Email id matched")
        res.json({ message: "Email already exists!!!" })
    } else if (emailCheck == false) {
        console.log("Creating new user");
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        await loginsModel.create({
            name: req.body.userName,
            email: req.body.emailAdress,
            phonenumber: req.body.phoneNumber,
            password: hashedPass,
        }).then((response) => {
            console.log("DataBase updated");
            res.status(200).json({ message: "User created successfully..." })

        })
    }
}


