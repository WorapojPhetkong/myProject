import { Router } from "express";
import { client } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const keywords = req.query.keywords;
  const category = req.query.category;

  const filterObject = {};

  if (category) {
    filterObject.category = category;
  } else if (keywords) {
    filterObject.name = new RegExp(keywords, "i");
  }
  const db = client.db("practice-mongo");
  const collection = db.collection("products");

  const results = await collection.find(filterObject).limit(5).toArray();
  res.json({
    data: results,
  });
});

productRouter.get("/:id", async (req, res) => {
  const productId = ObjectId(req.params.id);
  const collection = client.db("practice-mongo").collection("products");
  const results = await collection.findOne({
    _id: productId,
  });
  return res.json({
    data: results,
  });
});

productRouter.post("/", async (req, res) => {
  const collection = client.db("practice-mongo").collection("products");
  const newProduct = {
    ...req.body,
    created_date: new Date(),
  };
  await collection.insertOne(newProduct);

  return res.json({
    message: "Product has been created.",
  });
});

productRouter.put("/:id", async (req, res) => {
  const productId = ObjectId(req.params.id);
  const updatedProduct = { ...req.body };
  const collection = client.db("practice-mongo").collection("products");
  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: updatedProduct,
    }
  );

  return res.json({
    message: `Product ${productId} has been updated.`,
  });
});

productRouter.delete("/:id", async (req, res) => {
  const productId = ObjectId(req.params.id);
  const collection = client.db("practice-mongo").collection("products");
  await collection.deleteOne({ _id: productId });
  return res.json({
    message: `Product ${productId} has been deleted.`,
  });
});

export default productRouter;

// let products = [
//   {
//     id: 1,
//     name: "Fond - Neutral",
//     price: 160,
//     image: "http://dummyimage.com/350x350.png/dddddd/000000",
//     description: "Morbi non quam nec dui luctus rutrum. Nulla tellus.",
//   },
//   {
//     id: 2,
//     name: "Pepper - Cubanelle",
//     price: 7624,
//     image: "http://dummyimage.com/350x350.png/cc0000/ffffff",
//     description: "Nulla facilisi.",
//   },
// ];
