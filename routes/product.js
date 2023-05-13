const express = require('express');
const router = express.Router();
const CarController = require('../controller/cars');
const ProductController = require('../controller/products');
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const products = mongoCollections.products;

router.post('/insert', ProductController.upload,async (req, resp) => {
    let data = await ProductController.add_product(req.body)
    resp.send(data);
});

router.get('/getdata',async (req, resp) => {
    let data = await ProductController.find_product(req.query.id)
    resp.send(data);
});

router.put('/update/:id',ProductController.upload,async (req, resp) => {
    let id = req.params.id
    let data = await ProductController.update_product(id, req.body)
    resp.send(data)
});

router.delete('/deletedata/:id',async (req, resp) => {
    let data = await ProductController.delete_product(req.params.id)
    resp.send(data);
});

router.post('/uplode/:id', ProductController.upload, async (req, resp) => {
    let data = await ProductController.uplode_image(req.params.id, req.files)
    resp.send(data);
});

module.exports=router