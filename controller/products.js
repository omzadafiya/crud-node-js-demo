const { ObjectId } = require("bson");
const multer = require("multer");
const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const path = require("path")
const url = require("url")

async function add_product(data) {
    try {
        // let images = []
        // files?.forEach(async (file) => {
        //     images.push(file.originalname)
        // });

        let variants = combineAll(data?.options?.map(item => item?.optionvalue))

        let finalVariants = []

        variants.forEach((variant, index) => {
            let object = {
                option: variant,
                photo: "",
                price: ""
            }
            finalVariants.push(object)
        });

        let add = true;

        variants = JSON.stringify(variants)

        data.variant.forEach((item) => {
            if (variants.indexOf(JSON.stringify(item.options)) == -1) {
                add = false;
            }
        });
        if (add) {
            const productsCollection = await products();
            const insert_data = await productsCollection.insertOne({
                ...data,
                variant: data.variant
            })
            return insert_data
        }
        else {
            return "Invalid Variant"
        }

    } catch (error) {
        return error
    }
}
const combineAll = (array) => {
    const res = [];
    let max = array?.length - 1;
    const helper = (arr, i) => {
        for (let j = 0, l = array[i]?.length; j < l; j++) {
            let copy = arr.slice(0);
            copy.push(array[i][j]);
            if (i == max) {
                res.push(copy);
            }
            else
                helper(copy, i + 1);
        };
    };
    helper([], 0);
    return res;
};

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
}).array("file")

async function find_product(id) {
    try {
        const productsCollection = await products();
        const product_id = { _id: new ObjectId(id) }
        let data;
        if (id) {
            data = await productsCollection.findOne(product_id);
        } else {
            data = await productsCollection.find().toArray();
        }
        return data;
    }
    catch (error) {
        return error;
    }
}

async function update_product(id, data) {
    const productsCollection = await products();
    try {
        // let images = []
        // files?.forEach(async (file) => {
        //     images.push(file.originalname)
        // });

        let variants = combineAll(data?.options?.map(item => item?.optionvalue))

        let finalVariants = []

        variants.forEach((variant, index) => {
            let object = {
                option: variant,
                photo: "",
                price: ""
            }
            finalVariants.push(object)
        });

        let update = true;

        variants = JSON.stringify(variants)

        data.variant.forEach((item) => {
            if (variants.indexOf(JSON.stringify(item.options)) == -1) {
                update = false;
            }
        });
        if (update) {
            const update_data = await productsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        ...data,
                        variant: data.variant
                    }
                }
            )
            return update_data
        }
        else {
            return "Invalid Variant"
        }

    } catch (error) {
        return error
    }

}

async function delete_product(id) {
    try {
        const productsCollection = await products();
        const data = await productsCollection.deleteOne({ _id: new ObjectId(id) });
        console.log(data)
        return data;
    }
    catch (error) {
        return error
    }
}
async function uplode_image(id, file) {
    console.log(file)

    try {
        const productsCollection = await products();
        const newpath = path.join(process.cwd(), "public/images", file[0].originalname)
        newurl = url.pathToFileURL(newpath)
        const data = await productsCollection.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    image: file[0].originalname
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
    add_product,
    upload,
    find_product,
    update_product,
    delete_product,
    uplode_image
};