import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import Product from "./models/ProductModel.js";

//built middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//create a product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//get a single product
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    //we cannot find the product in the database
    if (!product) {
      return res
        .status(404)
        .json({ message: ` Cannot find product with id: ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    return res.status(200).json({ product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    // if we cannot find the product in the database
    if (!product) {
      return res
        .status(404)
        .json({ message: ` Cannot find product with id: ${id}` });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://kemboi:Raysita2002@backendapp.ectvbmb.mongodb.net/CRUD-API?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the database!");
    app.listen(3000, () => {
      console.log("app listening on port 3000!");
    });
  })
  .catch((error) => {
    console.log("Cannot connect to the database!", error);
  });
