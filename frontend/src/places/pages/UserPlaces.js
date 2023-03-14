// SHOW PLACES OF USER
// Route from App.js: path="/:userId/places"
import React from "react";
import { useParams } from 'react-router-dom';

import PlaceList from "../components/PlaceList";
import { DUMMY_PLACES } from "../../shared/util/constants";


const UserPlaces = props => {
  // Get param from dynamic route
  const userId = useParams().userId;
  const selectedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  
  return <PlaceList items={selectedPlaces} />
}

export default UserPlaces;
