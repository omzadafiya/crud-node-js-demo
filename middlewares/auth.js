const jwtKey = 'car'
const Jwt = require("jsonwebtoken");
const mongoCollections = require("../config/mongoCollections");
const User = mongoCollections.users;
module.exports = async (req, res, next) => {
    // console.log(req.headers["authorization"]);
    let token = req.headers["authorization"]?.split(" ")[1]

    Jwt.verify(token, jwtKey, async (err, data) => {
        if (data) {
            const userCollection = await User();
            const userExist = await userCollection.findOne(
                {
                    email: data.email,
                    password: data.password
                }
            )
            if (userExist) {
                next();
            }
            else {
                console.log("in user");
                res.json({
                    message: "User Unauthorized"
                })
            }
        }
        if (err) {
            console.log("in err");

            res.json({
                message: "User Unauthorized"
            })
        }
    })
}