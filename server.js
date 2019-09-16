const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const productRouter = require("./services/products")
const reviewRouter = require("./services/reviews")


const server = express();
console.log(__dirname)
server.use("/img", express.static(__dirname + "/images")) //C:\Users\Diego\Desktop\m6d5\images

server.use(cors()) //enable request from other websites
server.use(bodyParser.json())

server.use("/products", productRouter)
server.use("/reviews", reviewRouter)

server.listen(3600, () => {
    console.log("Hey, I'm running on 3600")
})