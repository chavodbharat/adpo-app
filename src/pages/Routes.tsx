import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonModal } from '@ionic/react';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import InnerMenu from '../components/InnerMenu';
import Map, {Marker, Popup, GeolocateControl, Source, Layer} from 'react-map-gl';
import { Plugins, Capacitor } from '@capacitor/core';
import { useHistory } from 'react-router-dom';
import GpsSinglePointComponent from '../components/GpsSinglePointComponent';
import Disclaimer from "../components/Disclaimer";
import 'mapbox-gl/dist/mapbox-gl.css';
import {localStore} from '../App';
import PageEventHandler from "../components/PageEventHandler"
import './Routes.css';

const Routes: React.FC = () => {

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxlLWFydCIsImEiOiJja3V6cWdrZWgyOXp1MnVvMGVlNzg5cjBiIn0.em7b7nOW4ukUxkGqCTotMw';
  const pageName = "Idrovia navigabile";
  // this will be set in GpsSinglePointComponent
  const [userCoords, setUserCoords] = useState<any|null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [disclaimerCheck, setDisclaimerCheck] = useState(false);
  const history = useHistory();

   // js code to programmatically trigger the geolocation service on map load
   // this is being called on Map.onStyleData as Map.onload doesn't get called
   function activateGeolocator()
   {
       (document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0] as HTMLElement).click();
       setStyleLoaded(true);
   }

   function setCheckbox(value: boolean)
   {
      localStore.set("disclaimerCheck", true);
      setDisclaimerCheck(true);
      setShowModal(false);
   }


   // fetch the state of disclaimer checkbox - if the state was not in memory, show it again.
   async function fetchDisclaimerCheck()
   {
     localStore.get("disclaimerCheck")
       .then(
         (value) =>
         {
           if (value != null || value)
           {
             console.log('Disclaimer accettato.');
             setDisclaimerCheck(true);
             setShowModal(false);
           }
           else
           {
             console.log('Disclaimer non ancora accettato.');
             setDisclaimerCheck(false);
             setShowModal(true);
           }
         },
         (error) =>
         {
           console.log('Info sul Disclaimer non trovate.');
           setDisclaimerCheck(false);
           setShowModal(true);
         }
     );
   }

   function checkDisclamerCheckbox()
   {
     if (disclaimerCheck) // the user actually checked the box
     {
       console.log('checkbox cliccata!');
       setShowModal(false)
     }
     else // the user pressed the backbutton to avoid checking the box - send him to the home page
     {
        if (Capacitor.isNative)
        {
          console.log('Back cliccato!');
          if (showModal)
          {
            console.log('Back cliccato con la Modal presente!!');
            history.push("/home");
          }
        }
     }
   }

   useEffect(() => {
     fetchDisclaimerCheck();
  }, []);


    const layerStyle = {
      'id': 'route',
      'type': 'line' as 'line',
      'source': 'route',
       'paint': {
         'line-color': '#226be8',
         'line-width': 3
       }
    };

  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start">{pageName}</h1>
        </IonItem>
        <Map id="routeMap"
          initialViewState={{
            latitude: 45.1805924522949,
            longitude: 9.15369798292832,
            zoom: 11
          }}
          mapStyle="mapbox://styles/ale-art/cl3fwbd56007p14th6ytpahyw"
          mapboxAccessToken={MAPBOX_TOKEN}
          onStyleData={activateGeolocator}
        >
          {/* not using my own local source to draw navigation route but getting it from the remote mapbox studio style */}
          {/*<Source id="route" type="geojson" data="./assets/routes/linea_nav_portolano.geojson">
            <Layer {...layerStyle} />
          </Source>*/}
         <GeolocateControl showUserLocation={true} trackUserLocation={true} showAccuracyCircle={true} showUserHeading={true} />
       </Map>
         {/* Card Modal   backdropDismiss​={false} */}
        <IonModal
         isOpen={showModal}
         swipeToClose={false}
         onDidDismiss={() => checkDisclamerCheckbox()}>
         {/* custom content created to show the big text and the disclaimer checkbox - passing to the child the method to trigger the closing of the modal */}
          <Disclaimer setDisclaimerChecked={setCheckbox}/>
        </IonModal>
      </IonContent>
      <GpsSinglePointComponent setUserCoords={setUserCoords}/> {/* pass the setter function to the child so we maintain the state watcher */}
      <PageEventHandler pageIndex={13} dockIndex={0}/>
      </IonPage>
  );
};

export default Routes;
