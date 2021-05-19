const express = require('express');
const router = express.Router();
const artworks = require('../controllers/artworks');
const catchAsync = require('../utils/catchAsync');
// const { isLoggedIn, isAuthor, validateCollection } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Artwork = require('../models/artwork');

router.get('/checkout', function (req, res, next) {
    const artworks = req.session.cart;
    res.render('checkout', {
        artworks: artworks,
        cart: req.session.cart
        // title: "Shopping Cart"
    });
});


router.get('/add/:artwork', function (req, res) {
    const slug = req.params.artwork
    Artwork.findOne({ slug: slug }, function (err, artwork) {
        if (err) return console.log(err);
        if (req.session.cart === undefined) {
            req.session.cart = [];
            req.session.cart.push({
                id: artwork._id,
                title: artwork.title,
                qty: 1,
                price: artwork.price,
                photos: artwork.photos    //(req.files.map(f => ({ url: f.path, filename: f.filename })))
            });    
        } else {
            let item = req.session.cart.find(item => {
                return item.id == artwork._id;
            });

            if (item) {
                item.qty++;
            } else {
                req.session.cart.push({
                    id: artwork._id,
                    title: artwork.title,
                    qty: 1,
                    price: artwork.price,
                    photos: artwork.photos  //(req.files.map(f => ({ url: f.path, filename: f.filename })))
                });
            }
        }
        res.redirect('/cart/checkout')
        // res.redirect('/cart/checkout', {
        //     title: "Shopping Cart"
        // });
    });
});

router.get('/update/:artwork', function (req, res, next) {
    let action = req.query.action;
    let artwork = req.session.cart.find(item => {
        return item.id == req.params.artwork;
    });
    let index = req.session.cart.indexOf(artwork);
    switch (action) {
        case 'add':
            artwork.qty++;
            break;
        case 'min':
            artwork.qty--;
            if (artwork.qty < 1) {
                req.session.cart.splice(index, 1)
            }
            break;
        case "clear":
            req.session.cart.splice(index, 1);
            if (artwork.qty <= 0)
                delete req.session.cart;
            break;
        
        default:
            res.redirect('/cart/checkout');
            break;
    }
    res.redirect('/cart/checkout')
    // res.redirect('/cart/checkout', {
    //     title: "Shopping Cart"
    // });
});

router.get('/cancel', function(req, res, next) {
    res.redirect('/artworks');
});


module.exports = router;