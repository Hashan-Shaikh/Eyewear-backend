const { Prod, validateProd } = require('../models/products');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/', async (req, res, next) => {
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
    //     if (String(user.role) != "admin") {
    //         return res.status(400).json({ message: "user is not priveleged" });
    //     }
    // });
    try {
        const prods = await Prod.find();
        if (!prods) { return res.status(404).json({ message: "products not found" }) }
        res.status(200).json({ prods });
    }
    catch (err) {
        return new Error(err);
    }
});

router.post('/', async (req, res, next) => {
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
    //     if (String(user.role) != "admin") {
    //         return res.status(400).json({ message: "user is not priveleged" });
    //     }
    // });
    const { error } = validateProd(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    //const hashedPassword = bcrypt.hashSync(req.body.password);
    const prod = new Prod({
        name: req.body.name,
    });
    try {
        await prod.save();
        res.status(200).json({ message: "prod created successfully" });
    }
    catch (err) {
        return new Error(err);
    }
});

router.delete("/", async (req, res, next) => {
    const cookies = req.header.cookies;
    if (!cookies) { return res.status(404).json({ message: "cookies not found!" }); }
    const token = cookies.split("=")[1];
    if (!token) { return res.status(404).json({ message: "token not found" }); }
    jwt.verify(String(token), config.get("jwtPrivateKey"), (err, user) => {
        if (err) {
            return res.status(400).json({ message: "invalid token" });
        }
        if (String(user.role) != "admin") {
            return res.status(400).json({ message: "user is not privileged" });
        }

    });
    try {
        const prod = await Prod.findOneAndRemove({ name: req.body.name });
        res.status(200).json({ message: "Product was deleted succesfully" }); ""
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: "Product cant be deleted!" });
    }

});

router.put("/:id", async (req, res, next) => {
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
    //     if (String(user.role) != "admin") {
    //         return res.status(400).json({ message: "user is not priveleged" });
    //     }
    // });
    const { error } = validateProd(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    try {
        const prod = await Prod.findById(req.params.id)
        if (!prod) {
            res.status(404).send({ message: 'prod not found!' });
        }
        const result = await Prod.findByIdAndUpdate({ _id: req.params.id }, {
            name: req.body.name,
        }, { new: true });

        res.status(200).send({ result })
    }
    catch (err) {
        console.log(err.message);
    }
});

module.exports = router;