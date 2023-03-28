// Render place item
// Used in component PlaceList
import React, { useContext, useState } from 'react';

import Card from '../../shared/components/UIElement/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElement/Modal';
import Map from '../../shared/components/UIElement/Map';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceItem.css';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Open/Close map
  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  // Open/Close deletion warning
  const showDeleteWarningHandler = () => {
    setShowDelete(true);
  };

  const closeDeleteWarningHandler = () => {
    setShowDelete(false);
  };

  const confirmDeleteHandler = async () => {
    setShowDelete(false);
    console.log('DELETING...');
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE'
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log('[ERROR] in delete-place: ' + err.message);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          {/* <h2>THE MAP</h2> */}
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      {/* Modal for Deletion warning */}
      <Modal
        show={showDelete}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={closeDeleteWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to delete this place? Please note that it cannot be undone
          thereafter.
        </p>
      </Modal>
      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
