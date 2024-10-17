import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { Storage } from '@ionic/storage';
import { Device } from '@capacitor/device';
import { registerPlugin } from '@capacitor/core'
import {BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
import React, {useEffect} from 'react';
import Menu from './components/Menu';
import Home from './pages/Home';
import Docks from './pages/Docks';
import DocksMap from './pages/DocksMap';
import Dock from './pages/Dock';
import Maps from './pages/Maps';
import Islands from './pages/Islands';
import IslandsMap from './pages/IslandsMap';
import Routes from './pages/Routes';
import Batimetric from './pages/Batimetric';
import Signs from './pages/Signs';
import Bridges from './pages/Bridges';
import Rulebook from './pages/Rulebook';
import Feedback from './pages/Feedback';
import Credits from './pages/Credits';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
// global custom style 
import './theme/globalStyle.css';
/* array of vertices of the polygon defyning the relevant area around the Po river */
import {shapeVertices} from "./js/asta_po.js";
// import {shapeVertices} from "./js/asta_po_wide.js";

setupIonicReact();

// local storage
const localStore = new Storage();
let deviceId = "-";
const appVersion = "1.3";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

const App: React.FC = () => {

  var coordsList : any[] = [];
  var operatorsList : any[] = [];
  const serverUrl = "https://www.portolanodelpo.it/poServer/poServer.php";
  var watcherId = "";

  // create loacl storage object
  async function createLocalStorage()
  {
    await localStore.create();
  }

  // retrieve the device UUID
  const getDeviceInfo = async () => {
    await Device.getId().then((devId) => deviceId = devId.uuid );
  };

  useEffect(() => {
    getDeviceInfo();      // retrieve unique device ID for the whole app
    createLocalStorage(); // create local storage object for the whole app
    fetchOperatorsUuid(); // remove watcher if this user is a River Operator
    activateGeoWatcher();
   }, []); // empty dependency array to call userEffect() only once, onload.

   // fetch the list of uuids from memory - if none, fetch it from server - or return an empty array
   async function fetchOperatorsUuid()
   {
     if (operatorsList == null || operatorsList.length === 0)
     {
       // firstly try to get data from server
       fetchRemoteOperatorsUuid().then(operatorsList => {
         if (operatorsList)
         {
           // console.log('Informazioni sugli uuid dei meatori scaricate:',operatorsList);
           killGeoWatcher(operatorsList);
         }
         else
         {
           localStore.get("operatorsList")
             .then(
               (operatorsList) =>
               {
                 if (operatorsList != null)
                 {
                   // console.log('Informazioni sugli uuid dei meatori da local storage ',operatorsList);
                   killGeoWatcher(operatorsList);
                 }
                 else
                 {
                   console.log('Non sono presenti informazioni sugli uuid dei meatori in memoria');
                 }
               },
               (error) =>
               {
                 console.log('Problema nella ricezione dei dati sugli uuid dei meatori',error);
               }
           );
         }
       });
     }
     else
     {
       // console.log('Informazioni sugli uuid dei meatori presenti in var:',operatorsList);
       killGeoWatcher(operatorsList);
     }
   }

   // fetch the list of uuids from server
   async function fetchRemoteOperatorsUuid():Promise<[any]|null>
   {
     return new Promise(function(resolve,reject)
     {
       // load uuids from server
       const url = `https://www.portolanodelpo.it/poServer/poServer.php?act=9&h=gkzLoFk0MN58TGqCJj`;
       fetch(url)
         .then(res => res.json())
         .then(
           (result) => {
             // console.log('Informazioni sugli uuid dei meatori scaricarte dal server.', result.content);
             localStore.set('operatorsList', result.content);
             resolve(result.content);
           },
           (error) => {
             // console.log('Problema nella ricezione dei dati sugli uuid dei meatori' ,error);
             resolve(null);
           }
       );
     });
   }

   async function activateGeoWatcher()
   {
     BackgroundGeolocation.addWatcher(
       {
           // On Android, a notification must be shown to continue receiving
           // location updates in the background. This option specifies the text of that notification.
           backgroundMessage: "Chiudi l'app per non essere tracciato.",
           // The title of the notification mentioned above. Defaults to "Using your location".
           backgroundTitle: "Tracciamento anonimo della posizione attivo.",
           // The minimum number of metres between subsequent locations. Defaults to 0.
           distanceFilter: 50
       },
       function callback(location: any, error: any)
       {
         if (error)
         {
             if (error.code === "NOT_AUTHORIZED")
             {
                 if (window.confirm("L'App del Portolanod del Po ha bisogno della tua posizione per aiutarti a navigare lungo il Po ma devi dare il permesso all'app.\n\nVuoi andare alla schermata di configurazioni adesso?"))
                 {
                     // It can be useful to direct the user to their device's settings when location permissions have been denied.
                     // The plugin provides the 'openSettings' method to do exactly this.
                     BackgroundGeolocation.openSettings();
                 }
             }

             return console.error(error);
         }
         else if (relevantPoint([location.longitude, location.latitude])) // check wheter this point falls within relevant areas
         {
           const postData = {
             time: location.time,
             lat: location.latitude,
             lng: location.longitude,
             uuid: deviceId,
             h: "gkzLoFk0MN58TGqCJj",
             act: 8
           }

           fetch(serverUrl, {
               method: 'post',
               mode: 'cors', // this has to be 'cors'
               body: JSON.stringify(postData),
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
                 }
               })
             .then(res => res.json())
             .then(
               (response) => {
                 // if the call went well, send also the coordinates that we have in memory
                 sendStoredCoordinates();
               },
               (error) => {
                 // console.log('Problema nell\'invio della posizione 1 - internet assente? ', error);
                 // store in memory till internet connection won't be back
                 storeCoordinatesInMemory(postData);
               })
             .catch(error => {
               // console.log('Problema nell\'invio della posizione 2 : ', error);
               // store in memory till internet connection won't be back
               storeCoordinatesInMemory(postData);
              })
          }
        })
     .then(function(watcher_id: any)
     {
       // When a watcher is no longer needed, it should be removed by calling 'removeWatcher' with an object containing its ID.
       watcherId = watcher_id; // store it to be used later if we need to kill the watcher
     });
   }

   // Determines if the given point is inside the shapeVertices polygon [point in polygon algorithm - ray cast algorithm]
   function relevantPoint(testPoint: number[])
   {
      let result = false;
      let j = shapeVertices.length - 1;
      
      for (let i = 0; i < shapeVertices.length; i++)
      {
        if (shapeVertices[i][1] < testPoint[1] && shapeVertices[j][1] >= testPoint[1] || shapeVertices[j][1] < testPoint[1] && shapeVertices[i][1] >= testPoint[1])
        {
            if (shapeVertices[i][0] + (testPoint[1] - shapeVertices[i][1]) / (shapeVertices[j][1] - shapeVertices[i][1]) * (shapeVertices[j][0] - shapeVertices[i][0]) < testPoint[0])
            {
                result = !result;
            }
        }
        j = i;
      }
      return result;
    }


   function killGeoWatcher(operatorsList: any[])
   {
     // console.log("Kill Geowatcher called - opertors: ",operatorsList.length);
     operatorsList.forEach(element => {
      //  console.log("Operator's uuid: ",element!.device_uuid);
       if (element!.device_uuid === deviceId) // got an operator!
       {
         BackgroundGeolocation.removeWatcher({
             id: watcherId
         });
         // console.log("Geowatcher "+watcherId+" Killed");
         return;
       }
     });
   }

  // store user coordinates ind evice memory for future attempts to send them to server
  function storeCoordinatesInMemory(dataToStore: any)
  {
    // console.log('Coordinate presenti in memoria: ', coordsList.length);
    coordsList.push(dataToStore);
    // console.log('Aggiunte nuove coordinate: ',coordsList.length);
  }

  // attempt to send stored user coordinates to server
  function sendStoredCoordinates()
  {
    if (coordsList != null && coordsList.length > 0) // need to send stored coordinates to the server
    {
      // console.log('Tentativo di invio delle coordinate presenti in memoria - tot: ', coordsList.length);
      let postData = coordsList[0];
      fetch(serverUrl, {
         method: 'post',
         mode: 'cors', // this has to be 'cors'
         body: JSON.stringify(postData),
         headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           }
         })
       .then(res => res.json())
       .then(
         (response) => {
           // if the data were sent correctly, remove them from the array
           coordsList.shift();
           // then go on with the next set of coordinates, it exists
           sendStoredCoordinates();
         },
         (error) => {
           console.log('Problema sul server nel tentativo di salvare coordinate memorizzate: ', error);
         })
       .catch(error => {
         console.log('Problema nell\'invio della posizione salvata sul server: ', error);
       });
     }
  }


  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/home" />
            </Route>
            <Route path="/home" exact={true}>
              <Home />
            </Route>
            <Route path="/docks" exact={true}>
              <Docks />
            </Route>
            <Route path="/docksMap" exact={true}>
              <DocksMap />
            </Route>
            <Route path="/docksMap/:id" exact={true}>
              <DocksMap />
            </Route>
            <Route path="/dock/:id" exact={true}>
              <Dock />
            </Route>
            <Route path="/maps" exact={true}>
              <Maps />
            </Route>
            <Route path="/islands" exact={true}>
              <Islands />
            </Route>
            <Route path="/islandsMap" exact={true}>
              <IslandsMap />
            </Route>
            <Route path="/routes" exact={true}>
              <Routes />
            </Route>
            <Route path="/batimetric" exact={true}>
              <Batimetric />
            </Route>
            <Route path="/signs" exact={true}>
              <Signs />
            </Route>
            <Route path="/bridges" exact={true}>
              <Bridges />
            </Route>
            <Route path="/rulebook" exact={true}>
              <Rulebook />
            </Route>
            <Route path="/feedback" exact={true}>
              <Feedback />
            </Route>
            <Route path="/credits" exact={true}>
              <Credits />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
export {localStore, deviceId, appVersion};

/*
https://ionicframework.com/docs/
https://ionicframework.com/docs/components
https://capacitorjs.com/docs/apis/geolocation#position

List of page indexes:
home: 0
docksMap: 1
docks: 2
dock: 3
maps: 4
islands: 5
islandsMap: 6
batimetric: 7
signs: 8
bridges: 9
rulebook: 10
feedback: 11
credits: 12
routes: 13 [not used]

*/
