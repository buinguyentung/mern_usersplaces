const express = require('express');

const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');

const placesController = require('../controllers/places-controller');

const router = express.Router();

router.get('/', placesController.getPlaces);

router.get('/:placeId', placesController.getPlaceById);

router.get('/user/:userId', placesController.getPlacesByUserId);

router.post(
  '/',
  fileUpload.single('image'), //middleware for file upload
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  placesController.createPlace
);

router.patch(
  '/:placeId',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  placesController.updatePlace
);

router.delete('/:placeId', placesController.deletePlace);

module.exports = router;
