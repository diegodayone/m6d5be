const express = require("express")
const idGen = require('shortid')
const multer = require("multer")
const path = require("path");
const utils = require("./utils")
const fs = require("fs-extra")

const router = express.Router();

getProducts = async () => {
    return await getItems("products.json")
    // var buffer = await fs.readFile("products.json");
    // var content = buffer.toString();
    // return JSON.parse(content);
}

saveProducts = async (products) => {
    await saveItems("products.json", products)
    // await fs.writeFile("products.json", JSON.stringify(products));
}

// products?category == smartphone 
router.get("/", async (req, res) => {
    var products = await getProducts()

    if (req.query.category)
        res.send(products.filter(x => x.category.toLowerCase() == req.query.category.toLowerCase()))
    else
        res.send(products)

    //res.send(products.filter(x => !req.query.category || x.category.toLowerCase() == req.query.category.toLowerCase()))
})

router.get("/:id", async (req, res) => {
    var products = await getProducts();
    res.send(products.find(x => x.ID == req.params.id))
})

router.get("/:id/reviews", async (req, res) => {
    var reviews = await getItems("reviews.json")
    res.send(reviews.filter(x => x.elementId == req.params.id))
})

var multerInstance = new multer({})

router.post("/", async (req, res) => {

    var products = await getProducts();
    var newProduct = req.body
    newProduct.createdAt = new Date()
    newProduct.updatedAt = newProduct.createdAt
    newProduct.ID = idGen.generate()

    products.push(newProduct)
    await saveProducts(products)

    res.send(newProduct)
})


// router.post("/", multerInstance.single("image"), async (req, res) => {
//     //1) save the picture
//     var fullUrl = req.protocol + "://" + req.get("host") + "/img/"
//     var ext = path.extname(req.file.originalname)
//     var productID = idGen.generate()
//     var fileName = productID + ext;
//     await fs.writeFile("./images/" + fileName, req.file.buffer)

//     console.log(req.body.metadata)

//     //2) save the product
//     var products = await getProducts();
//     //var newProduct = req.body;
//     var newProduct = JSON.parse(req.body.metadata)
//     newProduct.createdAt = new Date()
//     newProduct.updatedAt = newProduct.createdAt
//     newProduct.ID = productID
//     newProduct.Image = fullUrl + fileName
//     console.log(newProduct)
//     products.push(newProduct)
//     await saveProducts(products)

//     res.send(newProduct)
// })

router.post("/:id/image", multerInstance.single("image"), async (req, res) => {
    //1) save the picture
    var fullUrl = req.protocol + "://" + req.get("host") + "/img/"
    var ext = path.extname(req.file.originalname)
    var productID = req.params.id
    var fileName = productID + ext;
    await fs.writeFile("./images/" + fileName, req.file.buffer)

    //2) update image link
    var products = await getProducts();
    var toUpdate = products.find(x => x.ID == req.params.id)
    toUpdate.Image = fullUrl + fileName
    await saveProducts(products)

    res.send(toUpdate)
})

router.put("/:id", multerInstance.single("image"), async (req, res) => {

    if (req.file) {
        var fullUrl = req.protocol + "://" + req.get("host") + "/img/"
        var ext = path.extname(req.file.originalname)
        var fileName = req.params.id + ext;
        await fs.writeFile("./images/" + fileName, req.file.buffer)
    }

    var products = await getProducts();
    var oldProduct = products.find(x => x.ID == req.params.id)
    var newProduct = JSON.parse(req.body.metadata);
    newProduct.updatedAt = new Date();
    delete newProduct.ID;
    delete newProduct.createdAt;

    Object.assign(oldProduct, newProduct)

    await saveProducts(products)

    res.send(oldProduct)
})

router.delete("/:id", async (req, res) => {
    var products = await getProducts(); //get all products
    var productsWithoutDeletedOne = products.filter(x => x.ID != req.params.id); //get all the products that has ID != params.id
    await saveProducts(productsWithoutDeletedOne)
})

module.exports = router;