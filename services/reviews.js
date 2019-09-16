const express = require("express")
const idGen = require('shortid')
const multer = require("multer")
const path = require("path");
const utils = require("./utils")

const router = express.Router();

getReviews = async () => {
    return await getItems("reviews.json")
}

saveReviews = async (reviews) => {
    await saveItems("reviews.json", reviews)
}

router.get("/", async (req, res) => {
    var reviews = await getReviews()
    res.send(reviews);
})

router.get("/:id", async (req, res) => {
    var reviews = await getReviews();
    res.send(reviews.find(x => x.ID == req.params.id))
})


router.post("/", async (req, res) => {
    var reviews = await getReviews();
    var newReview = req.body
    newReview.createdAt = new Date()
    newReview.updatedAt = newReview.createdAt
    newReview.ID = idGen.generate()
    reviews.push(newReview)
    await saveReviews(reviews)

    res.send(newReview)
})

router.put("/:id", async (req, res) => {
    var reviews = await getReviews();
    var oldReview = reviews.find(x => x.ID == req.params.id)
    req.body.updatedAt = new Date();
    delete req.body.ID;
    delete req.body.createdAt;

    Object.assign(oldReview, req.body)

    await saveReviews(reviews)

    res.send(oldReview)
})

router.delete("/:id", async (req, res) => {
    var reviews = await getReviews(); //get all reviews
    var reviewsWithoutDeletedOne = reviews.filter(x => x.ID != req.params.id); //get all the reviews that has ID != params.id
    await saveReviews(reviewsWithoutDeletedOne)
})

module.exports = router;