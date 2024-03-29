// Hand-made hook for form validation
import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (let inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};

const useForm = (initialInputs, initialValidity) => {
  // Manage form-wide state
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  });

  // useCallback(): remember function to prevent from unnecessary re-render
  // a flexible input handler
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  // Update hook data
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({ type: 'SET_DATA', inputs: inputData, isValid: formValidity });
  }, []);

  return [formState, inputHandler, setFormData];
};

export default useForm;
