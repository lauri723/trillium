const express = require('express')
const router = express.Router()
const Collection = require('../models/collection')
const Artwork = require('../models/artwork')
const Leaf = require('../models/leaf')
const Student = require('../models/student')

router.get('/', async (req, res) => {
    const collections = await Collection.find({}).sort({ orderKey: 1 }).sort({ createdAt: 'desc' })
    const leaves = await Leaf.find({}).sort({ orderKey: 1 })
    res.render('index', {
        collections,
        leaves,
        searchOptions: req.query,
    })
})

router.get('/admin', async (req, res) => {
    const collection = await Collection.findOne({ slug: req.params.slug })
    const collections = await Collection.find({}).sort({ createdAt: 'desc' })
    const artworks = await Artwork.find({})
    const artwork = await Artwork.findOne({ slug: req.params.slug })
    const leaves = await Leaf.find({}).sort({ createdAt: 'desc' })
    const leaf = await Leaf.findOne({ slug: req.params.slug })
    const students = await Student.find({}).sort({ createdAt: 'desc' })
    const student = await Student.findOne({ slug: req.params.slug })
    res.render('admin', { collections, collection, artwork, artworks, leaves, leaf, student, students })
})

module.exports = router