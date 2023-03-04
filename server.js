const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const logins = require('./Models/loginsmodel')

const userRoutes = require('./Routes/userRoutes');
const sequelize = require('./utility/databaseConnection');
app.use('/user',userRoutes)


 sequelize.sync({}).then(result => 
    {
        console.log("Database sync done")
        // console.log(result)

    }).catch(err => {
        console.log(err)
    })
app.listen(1000);
