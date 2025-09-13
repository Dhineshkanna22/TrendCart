const Collection = require("../model/collectionModel");

const createNewCollection = async (req, res) => {
  try {
    const { name, image } = req.body;
    const collection = new Collection({ name, image });
    await collection.save();
    return res.status(200).send({ collection });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const removeCollection = async (req, res) => {
  try {
    const { collectionID } = req.params;
    await Collection.findByIdAndDelete(collectionID);
    return res.status(200).send({ message: "Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const getAllCollection = async (req, res) => {
  try {
    // Fetch all collections and populate the "items" field
    const collections = await Collection.find().populate("items");

    return res.status(200).json({
      success: true,
      message: "Collections retrieved successfully",
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getSingleCollection = async (req, res) => {
  try {
    const { id } = req.body;
    const collection = await Collection.findById(id).populate("items");
    return res.status(200).send(collection);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  createNewCollection,
  removeCollection,
  getAllCollection,
  getSingleCollection,
};
