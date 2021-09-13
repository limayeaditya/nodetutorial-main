const Advertisement = require("../../models/advertisement");
const moment = require("moment");

const updateaAvertisement = async (req, res) => {
  try {
    const {
      _id,
      property_details: { property_title, property_type, description, n_bhk, carpet_area },
      address: { city, area_details },
      quoted_price,
      interested,
      image,
    } = req.body;

    if (!_id) {
      res.status(400).json({
        error: "ID is required.",
      });
    }

    if (
      await Advertisement.updateOne(
        {
          _id,
        },
        {
          property_details: {
            property_title,
            property_type,
            description,
            n_bhk,
            carpet_area
          },
          address: {
            city,
            area_details,
          },
          quoted_price,
          interested,
          image,
          posted_on: moment().format("dddd, MMMM Do YYYY").toString(),
        }
      )
    ) {
      res.status(200).json({
        message: `advertisement ${_id} updated successfully`,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
module.exports = {
  updateaAvertisement,
};
