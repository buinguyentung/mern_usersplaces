import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useForm from '../../shared/hooks/form-hook';

import { DUMMY_PLACES } from '../../shared/util/constants';
import Input from '../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElement/Card';
import './NewPlace.css';

// For form-wide state reducer (title, description, address)
const initialInputs = {
  title: {
    value: '',
    isValid: false,
  },
  description: {
    value: '',
    isValid: false,
  },
};

// Note that we are not allowed to call any hooks inside other functions or hooks.
// So we must pass the initial value to useForm() hook.
// Then only after fetching the data (e.g., useEffect()),
// we update the new value to useForm()
const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Get param from dynamic route
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(initialInputs, false);

  // Simulate data fetch and update
  const selectedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  // use useEffect() to prevent infinite loop
  useEffect(() => {
    if (selectedPlace) {
      setFormData(
        {
          title: {
            value: selectedPlace.title,
            isValid: true,
          },
          description: {
            value: selectedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, selectedPlace]);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!selectedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place {placeId}!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <Card>
          <h2>Loading...</h2>
        </Card>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
