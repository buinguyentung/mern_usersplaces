import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// import { DUMMY_PLACES } from '../../shared/util/constants';
import Input from '../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElement/Card';
import useForm from '../../shared/hooks/form-hook';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
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
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(initialInputs, false);

  const [selectedPlace, setSelectedPlace] = useState();

  // Get param from dynamic route
  const placeId = useParams().placeId;

  // Simulate data fetch and update
  // const selectedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  // use useEffect() to prevent infinite loop
  // Query place from DB by place id
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setSelectedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log('[ERROR] in fetch a place: ' + err.message);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    // Send to BE
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        },
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        })
      );
      // Re-direct to another page
      navigate('/' + auth.userId + '/places');
    } catch (error) {
      console.log('[ERROR] in update-place: ' + error.message);
    }
  };

  if (!isLoading && !error && !selectedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place {placeId}!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && selectedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={selectedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={selectedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
