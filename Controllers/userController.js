const loginsModel = require('../Models/loginsmodel')
const bcrypt = require('bcrypt')
const dataCheck = require('../Models/functions')
const jwt = require('jsonwebtoken');


/**
 * These Controller require certain functions to perform checks on data
 * they are in Model/functions
 */
exports.signup = async (req, res) => {

    console.log("Entering signup")
    const emailCheck = await dataCheck.usernameCheck(req.body.emailAdress)
    console.log("email check is", emailCheck)
    if (emailCheck == true) {
        console.log("Email id matched")
        res.status(401).json({ message: "User already exists, Please Login" })
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
            res.status(200).json({ message: "Successfully signed up" })

        })
    }
}



exports.signin = async (req, res) => {

    console.log(req.body)
    const loginData = await dataCheck.fetchlogins(req.body.emailAdress);

    if (loginData == false) {
        res.status(404).json({ message: "User doesnt exist, please sign up" })
    } else {
        const hashpass = loginData[0].password;

        const comparePass = await bcrypt.compare(req.body.password, hashpass)

        if (comparePass == false) {
            res.status(401).json({ message: "Incorrect Password, Please try again" })
        } else if (comparePass == true) {
            res.status(200).json({ token: await generateJWToken(loginData[0].id), message: "Login Successful" })

        }
    }

}






async function generateJWToken(key) {
    return jwt.sign({ id: key }, process.env.jwtSecretKey);;
}

