const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

// Models
const Place = require('../models/places-model');
const User = require('../models/users-model');


/**
 * Get the list of all places.
 */
const getPlaces = async (req, res, next) => {
  console.log('GET Request in places');
  // res.json({places: DUMMY_PLACES});
  let places = [];
  try {
    places = await Place.find();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Could not find any places.', 500));
  }
  res.json({places: places.map(p => p.toObject({ getters: true }))}); // convert _id to id
};

/**
 * Get place's information by place id.
 */
const getPlaceById = async (req, res, next) => {
  console.log('GET Request for place ' + req.params.placeId);
  const placeId = req.params.placeId;

  // const place = DUMMY_PLACES.find(p => p.id === placeId);
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Could not find a place.', 500));
  }

  if (!place) {
    const error = new HttpError('Could not find a place for the provided place id', 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true })}); // { place } => { place: place }
};

/**
 * Get the list of all places created by user id.
 */
const getPlacesByUserId = async (req, res, next) => {
  console.log('GET all places for a given user id ' + req.params.userId);
  const userId = req.params.userId;

  // const places = DUMMY_PLACES.filter(p => p.creator === userId);
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Could not find any places.', 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find any place for the given user id', 404));
  }

  res.json({places: places.map(p => p.toObject({ getters: true }))});
}

/**
 * Create a new place.
 */
const createPlace = async (req, res, next) => {
  // validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
  {
    console.log(errors);
    // NOTE: THROW WILL NOT WORK WITH ASYNC CODE
    // throw new HttpError('Invalid input passed! Please try again!', 422);
    return next(new HttpError('Invalid input passed! Please try again!', 422));
  }

  // extract input
  const { title, description, address, creator } = req.body;

  // find the coordinates for address
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    return next(err);
  }

  // check creator's existence
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Create place failed.'), 500);
  }
  if (!user) {
    return next(new HttpError('Create place failed. User does not exist.'), 500);
  }
  console.log('user = ' + user);

  // create new place
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: '/images/van-mieu.jpg',
    creator
  });
  // DUMMY_PLACES.push(createdPlace);
  try {
    // Start new session for multiple transactions
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Create place failed.'), 500);
  }
  res.status(201).json({place: createdPlace.toObject({ getters: true })});
}

/**
 * Update place data. Allow to modify the title and description. 
 */
const updatePlace = async (req, res, next) => {
  // validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
  {
    console.log(errors);
    throw new HttpError('Invalid input passed! Please try again!', 422);
  }

  const { title, description } = req.body;
  console.log('PATCH Request for place ' + req.params.placeId);
  const placeId = req.params.placeId;

  // SHOULD MODIFY ON A COPIED OBJECT
  // const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
  // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  // updatedPlace.title = title;
  // updatedPlace.description = description;
  // DUMMY_PLACES[placeIndex] = updatedPlace;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Could not update place.', 500));
  }
  if (!place) {
    const error = new HttpError('Could not find a place for the provided place id', 404);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Could not update place.', 500));
  }
  
  res.status(200).json({place: place.toObject({ getters: true })});
}

/**
 * Delete a place by id
 */
const deletePlace = async (req, res, next) => {
  console.log('DELETE Request for place ' + req.params.placeId);
  const placeId = req.params.placeId;

  // if (!DUMMY_PLACES.find(p => p.id === placeId)) {
  //   throw new HttpError('Could not find the place with given id!', 404);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id != placeId);

  // Check place's existence
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Could not delete place.', 500));
  }
  if (!place) {
    const error = new HttpError('Could not find a place for the provided place id.', 404);
    return next(error);
  }

  // Delete the place
  try {
    // await place.delete();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Something went wrong. Could not delete place.', 500));
  }
  
  res.status(200).json({message: "Deleted place."});
}

exports.getPlaces = getPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
