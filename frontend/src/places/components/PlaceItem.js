// Render place item
// Used in component PlaceList
import React, { useState } from 'react';

import Card from '../../shared/components/UIElement/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElement/Modal';
import Map from '../../shared/components/UIElement/Map';
import './PlaceItem.css';

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

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

  const confirmDeleteHandler = () => {
    setShowDelete(false);
    console.log('DELETING...');
  };

  return (
    <>
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
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
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
            <Button to={`/places/${props.id}`}>EDIT</Button>
            <Button danger onClick={showDeleteWarningHandler}>
              DELETE
            </Button>
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
