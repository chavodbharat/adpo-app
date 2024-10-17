import { IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonAlert, IonItem, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonAccordion, IonAccordionGroup, IonLabel, IonModal } from '@ionic/react';
import { Storage } from '@ionic/storage';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom'
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import Map, {Marker, Popup, GeolocateControl} from 'react-map-gl';
import { Plugins, Capacitor } from '@capacitor/core';
import { useHistory } from 'react-router-dom';
import GpsSinglePointComponent from '../components/GpsSinglePointComponent';
import Disclaimer from "../components/Disclaimer";
import {localStore} from '../App';
import {listOutline, chevronDownOutline } from 'ionicons/icons'
import 'mapbox-gl/dist/mapbox-gl.css';
import PageEventHandler from "../components/PageEventHandler"
import './DocksMap.css';
import {lookAtDistance} from "../js/dockDistanceCalculator.js";

const DocksMap: React.FC = () => {

  const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxlLWFydCIsImEiOiJjbDFxbWxqa2wwZTNlM2xvM3M4bTEzZGpiIn0.HoRycofAyQPZ33Niv-XRtA'; // Set your mapbox token here

  const pageName = "Attracchi";
  // get query parameter
  const { id } = useParams<{ id: string; }>();
  const [showAlert2, setShowAlert2] = useState(false);
  const [docksList, setDocksList] = useState<[any] | null>(null);
  const [loadingText, setLoadingText] = useState('Caricamento Attracchi...');
  const [selectedIndex, setSelectedIndex] = useState<number|null>(null);
  // this will be set in GpsSinglePointComponent
  const [userCoords, setUserCoords] = useState<any|null>(null)
  const [styleLoaded, setStyleLoaded] = useState(false)
  // next 3 are being used to check/show the disclaimer
  const [showModal, setShowModal] = useState(false);
  const [disclaimerCheck, setDisclaimerCheck] = useState(false);
  const history = useHistory();
  const [thisDockDistance, setThisDockDistance] = useState('Calcolo...');

  // fetch the list of docks from server or return an empty array
  async function fetchDocks()
  {
    if (docksList == null)
    {
      // firstly try to get data from server
      fetchRemoteDocks().then(remoteDocks => {
        if (remoteDocks)
        {
          setDocksList(remoteDocks);
        }
        else
        {
          localStore.get("dockslist")
            .then(
              (docks) =>
              {
                if (docks != null)
                {
                  console.log('Informazioni sugli attracchi presenti in memoria.');
                  setDocksList(docks);
                }
                else
                {
                    console.log('Non sono presenti informazioni sugli attracchi in memoria - scaricamento dal server');
                    setLoadingText('Non sono presenti informazioni sugli attracchi in memoria - scaricamento dal server');
                    fetchRemoteDocks().then(remoteDocks => setDocksList(remoteDocks));
                }
              },
              (error) =>
              {
                console.log('Problema nella ricezione dei dati sugli attracchi: ',error);
              }
            );
          }
        });
      }
  }

  async function fetchRemoteDocks():Promise<[any]|null>
  {
    return new Promise(function(resolve,reject)
    {
      // load docks from server
      const url = `https://www.portolanodelpo.it/poServer/poServer.php?act=1&h=gkzLoFk0MN58TGqCJj`;
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            localStore.set('dockslist', result.content);
            resolve(result.content);
          },
          (error) => {
            console.log('Problema nella ricezione dei dati sugli attracchi: ',error);
            setLoadingText('Problema nella ricezione dei dati sugli attracchi - riavviare l\'app e  riprovare');
            setShowAlert2(true);
            resolve(null);
          }
      );
    });
  }

   function closePopup()
   {
       setSelectedIndex(null)
   }

   function openPopup(index:number)
   {
       setSelectedIndex(index)
       if (selectedIndex != null)
        setThisDockDistance(lookAtDistance(docksList![selectedIndex], userCoords));
   }

   // js code to programmatically trigger the geolocation service on map load
   // this is being called on Map.onStyleData as Map.onload doesn't get called
   function activateGeolocator()
   {
     if (!styleLoaded && selectedIndex == null) // in case no dock was selected
     {
       (document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0] as HTMLElement).click();
       setStyleLoaded(true);
     }
   }

  // called by Disclaimer child component
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
  // make sure the user checked the disclaimer and not simply quit it some other way
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
    // firstly check the disclaimer
    fetchDisclaimerCheck();
    // if id is a number, set the index (use + to cast to int)
    if (!isNaN(+id))
      setSelectedIndex(parseInt(id));
    // get docks from memory or server
    fetchDocks();

    // every time a dock is selected, recalculate its distance from the user
    if (docksList != null && selectedIndex != null)
      setThisDockDistance(lookAtDistance(docksList[selectedIndex], userCoords));
  }, [docksList, selectedIndex]); // empty dependency array to call userEffect() only once, onload.


  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start">{pageName} & Idrovia Navigabile</h1>
          {/* commented for now as redundant
          <IonButton slot="end" href="/docks" fill="clear" size="large">
            <IonIcon icon={listOutline}></IonIcon>
          </IonButton>
          */}
        </IonItem>
        <IonAccordionGroup>
          <IonAccordion value="legend">
            <IonItem slot="header">
              <h2>Legenda</h2>
            </IonItem>
            <IonGrid slot="content">
              <IonRow>
                <IonCol key={1} size="2">
                  <IonIcon icon="./assets/images/line.svg" className="dock-legend-icon"></IonIcon>
                </IonCol>
                <IonCol key={2} size="10">
                  Idrovia navigabile
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol key={1} size="2">
                  <IonIcon icon="./assets/images/map-marker.svg" className="dock-legend-icon"></IonIcon>
                </IonCol>
                <IonCol key={2} size="10">
                  Attracchi
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol key={3} size="2">
                  <IonIcon icon="./assets/images/icona-idrometri.svg" className="dock-legend-icon"></IonIcon>
                </IonCol>
                <IonCol key={4} size="10">
                  Idrometri
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol key={5} size="2">
                  <IonIcon icon="./assets/images/icona-punti-rilievo.svg" className="dock-legend-icon"></IonIcon>
                </IonCol>
                <IonCol key={6} size="10">
                  Punti di rilievo batimetrico
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonAccordion>
        </IonAccordionGroup>

        {/* while loading */}
        {docksList == null &&
          <div>{loadingText}</div>
        }
        {/* if loading went fine */}
        {docksList != null && docksList.length > 0 &&
          <>
            <Map
              id="docksMap"
              initialViewState={{
                latitude: (id != null && selectedIndex != null ? docksList[selectedIndex].lat : 45.180637),
                longitude: (id != null && selectedIndex != null ? docksList[selectedIndex].lng : 9.148688),
                zoom: (id != null ? 16 : 12)
              }}
              // style={{width: 800, height: 600}}
              mapStyle="mapbox://styles/ale-art/cl1qnhp6m00b715qglkvaxm6o"
              mapboxAccessToken={MAPBOX_TOKEN}
              onStyleData={activateGeolocator}
            >
              {docksList.map((dock, index) => (
                    <Marker key={index} longitude={dock.lng} latitude={dock.lat} color="red" onClick={() => openPopup(index)} />
                ))
              }
              {/* add dock popup */}
              {selectedIndex !== null &&
                  <Popup
                    latitude={docksList[selectedIndex].lat}
                    longitude={docksList[selectedIndex].lng}
                    onClose={closePopup}
                    closeButton={true}
                    closeOnClick={false}
                    offset={35}
                    className="mapPopup"
                   >
                    <p><a href={`/dock/${selectedIndex}`}>{docksList[selectedIndex].name}</a></p>
                    <p>Attuale distanza: {thisDockDistance}</p>
                  </Popup>
               }
              <GeolocateControl showUserLocation={true} trackUserLocation={true} showAccuracyCircle={true} showUserHeading={true} />
            </Map>
            {/* Disclaimer Modal */}
           <IonModal
            isOpen={showModal}
            swipeToClose={false}
            onDidDismiss={() => checkDisclamerCheckbox()}>
            {/* custom content created to show the big text and the disclaimer checkbox - passing to the child the method to trigger the closing of the modal */}
             <Disclaimer setDisclaimerChecked={setCheckbox}/>
           </IonModal>
         </>
        }
      </IonContent>
      <IonAlert
        header={'Errore di recupero dati'}
        isOpen={showAlert2} message="C'è stato un problema nel recupero dei dati sugli attracchi! Per favore riavvia l'app e riprova." buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert2(false)} />
      <GpsSinglePointComponent setUserCoords={setUserCoords}/> {/* pass the setter function to the child so we maintain the state watcher */}
      <PageEventHandler pageIndex={1} dockIndex={0}/>
    </IonPage>
  );
};

export default DocksMap;
