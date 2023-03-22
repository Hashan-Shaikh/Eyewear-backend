const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Shop, validateShop } = require('../models/shop');
const { Prod, validateProd } = require('../models/products');
const { shopProd, shopProdValidate } = require('../models/shopProd');

router.get('/:id', async (req, res, next) => {
    // const cookies = req.headers.cookie;
    // if (!cookies) { return res.status(404).json({ message: "cookies not found" }) }

    // const token = cookies.split("=")[1];
    // if (!token) {
    //     return res.status(400).json({ message: "token not found!" });
    // }

    // jwt.verify(String(token), config.get("jwtPrivateKey"), (err, user) => {
    //     if (err) {
    //         return res.status(400).json({ message: "invalid token" });
    //     }
    //     if (String(user.role) != "shop") {
    //         return res.status(400).json({ message: "user is not priveleged" });
    //     }
    // });
    try {
        const shopProdd = await shopProd.find({ 'shop._id': req.params.id });
        if (!shopProdd) { return res.status(404).json({ message: "shops not found" }) }
        return res.status(200).json({ shopProd: shopProdd });
    }
    catch (err) {
        return new Error(err);
    }
});

router.post('/', async (req, res) => {
    const { error } = shopProdValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const shop = await Shop.findById(req.body.shop_id);
    if (!shop) return res.status(404).send('Shop not found');

    const shopProdd = new shopProd({
        shop: {
            _id: shop._id,
            name: shop.name,
            location: shop.location,
            email: shop.email,
            password: shop.password,
            role: shop.role
        },
        prod_name: req.body.product_name,
        quan: req.body.quan,
        unit_price: req.body.unit_price,
    });
    try {
        await shopProdd.save();
        res.status(200).json({ shopProd: shopProdd, message: "successful" });
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }
});

module.exports = router;
