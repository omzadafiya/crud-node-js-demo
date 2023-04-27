const { ObjectId } = require("bson");
const multer = require("multer");
const mongoCollections = require("../config/mongoCollections");
const cars = mongoCollections.cars;
const path = require("path")
const url = require("url")



const base_url = "http://localhost:3001/images/Portfolio-pic4.jpg";

async function addCar(data, files) {
    console.log(data.car_file);
    if (data.name == "" || data.name == null) {
        return "Please Enter Name.."
    }

    else if (data.brand == "" || data.brand == null) {
        return "Please Enter Brand.."
    }
    else if (data.price == "" || data.price == null) {
        return "Please Enter Price.."

    }
    else if (data.color == "" || data.color == null) {
        return "Please Enter Color.."
    }
    else {
        try {
            let images = []
            files.forEach(async (file) => {
                // const newpath = path.join(process.cwd(), "public/images", file?.originalname)
                // newurl = url.pathToFileURL(newpath)
                images.push(file.originalname)
            });
            const carsCollection = await cars();
            const insertInfo = await carsCollection.insertOne({
                ...data,
                image: images
            });
            return insertInfo;

        } catch (error) {
            return error
        }
    }

}
async function findCar(id) {
    const carsCollection = await cars();
    const car_id = { _id: new ObjectId(id) }
    let data;
    try {
        if (id) {
            data = await carsCollection.findOne(car_id);
        } else {
            data = await carsCollection.find().toArray();
        }

        const cars_item = data.map((item, index) => {
            data[index]['image_url'] = base_url + item.image
        })
        // base_url+item.image
        return data;
    }
    catch (error) {
        return error
    }
}
async function updateCar(id, data, file) {
    console.log(data);
    if (data.name == "" || data.name == null) {
        return "Please Enter Name.."
    }
    else if (data.brand == "" || data.brand == null) {
        return "Please Enter Brand.."
    }
    else if (data.price == "" || data.price == null) {
        return "Please Enter Price.."
    }
    else if (data.color == "" || data.color == null) {
        return "Please Enter Color.."
    } else {
        try {
            const carsCollection = await cars();
            if (id) {

                if (file) {
                    console.log("with image")
                    const updatedata = await carsCollection.updateOne(
                        { _id: new ObjectId(id) },
                        {
                            $set: {
                                ...data,
                                image: file.originalname
                            }
                        }
                    )
                    return updatedata;
                }
                else {
                    console.log("without image")
                    const updatedata = await carsCollection.updateOne(
                        { _id: new ObjectId(id) },
                        {
                            $set: {
                                ...data
                            }
                        }
                    )
                    return updatedata;
                }

            } else {
                return "Enter valid Id";
            }
        }
        catch (error) {
            return error
        }

    }

}

async function deleteCar(id) {
    try {
        const carsCollection = await cars();
        const data = await carsCollection.deleteOne({ _id: new ObjectId(id) });
        return data;
    } catch (error) {
        return errors
    }
}

const upload = multer({

    storage: multer.diskStorage({
        destination: function (req, resp, callBack) {
            callBack(null, "public/images")
        },

        filename: function (req, file, callBack) {
            callBack(null, file.originalname)
        }
    }),
    fileFilter: function (req, file, callback) {
        var file_type = path.extname(file.originalname);
        if (file_type !== '.png' && file_type !== '.jpg' && file_type !== '.jpeg') {
            return callback('Only .png and .jpg Image allowed!')
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 200
    }
}).array("car_file")

async function uplode_image(id, file) {

    try {
        const carsCollection = await cars();
        console.log(file.originalname)
        const newpath = path.join(process.cwd(), "public/images", file.originalname)
        newurl = url.pathToFileURL(newpath)
        const data = await carsCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    image: file.originalname
                }

            }
        )
        return ({
            message: "File Uploaded",
            url: newurl.href
        })
    } catch (error) {
        return error
    }

}

module.exports = {
    addCar,
    findCar,
    updateCar,
    deleteCar,
    upload,
    uplode_image
};