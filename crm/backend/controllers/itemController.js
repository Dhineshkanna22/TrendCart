const Collection = require("../model/collectionModel");
const Item = require("../model/itemModel");
const addNewItem = async (req, res) => {
  try {
    const { collectionID, name, price, stock, images, discountedPrice } =
      req.body;
    const collection = await Collection.findById(collectionID);
    const newItem = new Item({ name, price, stock, images, discountedPrice });
    await newItem.save();
    await collection.items.push(newItem);
    await collection.save();
    return res.status(200).send({
      message: "Item added succesfully",
      succes: true,
      collection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const { itemID } = req.body;
    const item = await Item.findByIdAndDelete(itemID);
    await item.save();
    return res.status(200).send({
      message: "Item removed succesfully",
      succes: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
      error: error,
    });
  }
};

const getSingleItem = async (req, res) => {
  try {
    const { id } = req.body;
    const item = await Item.findById(id);
    return res.status(200).send({
      message: "Item fetched succesfully",
      succes: true,
      item,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
      error: error,
    });
  }
};
module.exports = { addNewItem, removeItem, getSingleItem };
