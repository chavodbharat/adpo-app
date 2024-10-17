import { IonAlert, useIonViewWillEnter } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import React, { useState, useEffect } from 'react';


interface UserCoordinates
{
    setUserCoords: any
}

/**
This component is only used to get user GPS coordinates and requires a setter method to
a "any" state-object created on the parent class, which will be called once the coordinates
get retrieved.
[see Docks.tsx as example]
*/
const GpsSinglePointComponent: React.FC<UserCoordinates> = ({setUserCoords}) => {

  const [coords, setCoords] = useState<any|null>(null)
  const [showAlert, setShowAlert] = useState(false);

  const getCurrentPosition = async () =>
  {
    await Geolocation.getCurrentPosition({enableHighAccuracy: true})
      .then(coordinates => {
        setUserCoords(coordinates.coords);
      })
      .catch( error =>
      {
        console.log('getCurrentPosition:: ERROR ', error);
        setShowAlert(true);
      });
  };

  // try to get fresh GPS coordinates everytime the user opens this view
  useIonViewWillEnter(() => {
    getCurrentPosition();
  });

  return (
    <IonAlert
      header={'Errore di recupero coordinate GPS'}
      isOpen={showAlert} message="C'è stato un problema nel recupero delle tue coordinate GPS. Per favore abilita il navigatore nelle impostazioni del telefono." buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert(false)} />
  );
};

export default GpsSinglePointComponent;
