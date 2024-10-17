import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonIcon, IonButton, IonAlert } from '@ionic/react';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import InnerMenu from '../components/InnerMenu';
import Map, {Marker, Popup, GeolocateControl, Source, Layer} from 'react-map-gl';
import GpsSinglePointComponent from '../components/GpsSinglePointComponent';
import {localStore} from '../App';
import PageEventHandler from "../components/PageEventHandler"
import 'mapbox-gl/dist/mapbox-gl.css';
import './IslandsMap.css';

const IslandsMap: React.FC = () => {

  const MAPBOX_TOKEN = '';
  const pageName = "Isole naturalistiche e Rete Natura 2000";

  const [showAlert2, setShowAlert2] = useState(false);
  const [islandsList, setIslandsList] = useState<[any] | null>(null);
  const [loadingText, setLoadingText] = useState('Caricamento Isole ecologiche...');
  const [selectedIndex, setSelectedIndex] = useState<number|null>(null);

  // this will be set in GpsSinglePointComponent
  const [userCoords, setUserCoords] = useState<any|null>(null)
  const [styleLoaded, setStyleLoaded] = useState(false)

  const islandPdfUrl = "https://www.portolanodelpo.it/wp-content/uploads/2022/05/RN2000_AstaPo.pdf";


    // fetch the list of islands from server or return an empty array
    async function fetchIslands()
    {
      if (islandsList == null)
      {
        // firstly try to get data from server
        fetchRemoteIslands().then(remoteIslands => {
          if (remoteIslands)
          {
            setIslandsList(remoteIslands);
          }
          else
          {
             localStore.get("islandslist")
              .then(
                (islands) =>
                {
                  if (islands != null)
                  {
                    console.log('Informazioni sugli attracchi presenti in memoria.');
                    setIslandsList(islands);
                  }
                  else
                  {
                      console.log('Non sono presenti informazioni sulle isole ecologiche in memoria - scaricamento dal server');
                      setLoadingText('Non sono presenti informazioni sulle isole ecologiche in memoria - scaricamento dal server');
                      fetchRemoteIslands().then(remoteIslands => setIslandsList(remoteIslands));
                  }
                },
                (error) =>
                {
                  console.log('Problema nella ricezione dei dati sulle isole ecologiche: ',error);
                }
              );
            }
          });
        }
    }

    async function fetchRemoteIslands():Promise<[any]|null>
    {
      return new Promise(function(resolve,reject)
      {
        // load islands from server
        const url = `https://www.portolanodelpo.it/poServer/poServer.php?act=5&h=gkzLoFk0MN58TGqCJj`;
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              localStore.set('islandslist', result.content);
              resolve(result.content);
            },
            (error) => {
              console.log('Problema nella ricezione dei dati sulle isole ecologiche: ',error);
              setLoadingText('Problema nella ricezione dei dati sulle isole ecologiche - riavviare l\'app e  riprovare');
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
     }

   // js code to programmatically trigger the geolocation service on map load
   // this is being called on Map.onStyleData as Map.onload doesn't get called
   function activateGeolocator()
   {
     if (!styleLoaded)
     {
       (document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0] as HTMLElement).click();
       setStyleLoaded(true);
     }
   }

     useEffect(() => {
       // get islands from memory or server
       fetchIslands();
     }, []); // empty dependency array to call userEffect() only once, onload.



     return (
       <IonPage>
         <IonHeader>
           <InnerMenu name={pageName} />
         </IonHeader>
         <IonContent fullscreen>
           <IonButton href="/islands" expand="block" fill="solid" className="ion-padding reg-islBtn" >
             Torna alla lista
           </IonButton>
           <IonButton target="_blank" rel="noreferrer" href={islandPdfUrl} expand="block" fill="solid" className="ion-padding signBtn">
             Legenda Aree naturali protette<br /> Rete Natura 2000
           </IonButton>
           {/* if loading went fine */}
           {islandsList != null && islandsList.length > 0 &&
             <>
             <Map
               id="islandMap"
               initialViewState={{
                 latitude: 45.1805924522949,
                 longitude: 9.15369798292832,
                 zoom: 11
               }}
               mapStyle="mapbox://styles/ale-art/cl3g0eg0b000r14qp6hseetrq"
               mapboxAccessToken={MAPBOX_TOKEN}
               onStyleData={activateGeolocator}
             >
               {islandsList.map((dock, index) => (
                     <Marker key={index} longitude={dock.lng} latitude={dock.lat} color="green" onClick={() => openPopup(index)} />
                 ))
               }
               {/* add island popup */}
               {selectedIndex !== null &&
                   <Popup
                     latitude={islandsList[selectedIndex].lat}
                     longitude={islandsList[selectedIndex].lng}
                     onClose={closePopup}
                     closeButton={true}
                     closeOnClick={false}
                     offset={35}
                     className="mapPopup"
                    >
                     <p>{islandsList[selectedIndex].name}</p>
                   </Popup>
                }
              <GeolocateControl showUserLocation={true} trackUserLocation={true} showAccuracyCircle={true} showUserHeading={true} />
            </Map>
            </>
          }
         </IonContent><IonAlert
           header={'Errore di recupero dati'}
           isOpen={showAlert2} message="C'è stato un problema nel recupero dei dati sulle isole ecologiche! Per favore riavvia l'app e riprova." buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert2(false)} />
         <GpsSinglePointComponent setUserCoords={setUserCoords}/> {/* pass the setter function to the child so we maintain the state watcher */}
         <PageEventHandler pageIndex={6} dockIndex={0}/>
       </IonPage>
     );
   };

export default IslandsMap;
