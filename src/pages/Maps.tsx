import { IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonAlert, IonItem, IonIcon, IonButton } from '@ionic/react';
import { Storage } from '@ionic/storage';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import GpsSinglePointComponent from '../components/GpsSinglePointComponent';
import { mapOutline, enterOutline } from 'ionicons/icons'
import {localStore} from '../App';
import PageEventHandler from "../components/PageEventHandler"
import './Maps.css';

const Maps: React.FC = () => {

  const pageName = "Mappe di Navigazione";

  const [showAlert2, setShowAlert2] = useState(false);
  const [mapsList, setMapsList] = useState<[any] | null>(null);
  const [loadingText, setLoadingText] = useState('Caricamento Mappe...');
  const [closestMap, setClosestMap] = useState<number|null>(null);
  const [surroundingMap, setSurroundingMap] = useState<string|null>(null);
  // this will be set in GpsSinglePointComponent
  const [userCoords, setUserCoords] = useState<any|null>(null)

  // fetch the list of maps from memory - if none fetch it from server - or return an empty array
  async function fetchMaps()
  {
    if (mapsList == null)
    {
      // firstly try to get data from server
      fetchRemoteMaps().then(remoteMaps => {
        if (remoteMaps)
        {
          setMapsList(remoteMaps);
        }
        else
        {
          // otherwise go with the locl storage
          localStore.get("mapslist")
            .then(
              (maps) =>
              {
                if (maps != null)
                {
                  console.log('Informazioni sulle mappe presenti in memoria.');
                  setMapsList(maps);
                }
                else
                {
                    console.log('Non sono presenti informazioni sulle mappe in memoria - riavviare l\'app e  riprovare');// - scaricamento dal server');
                    setLoadingText('Non sono presenti informazioni sulle mappe in memoria - riavviare l\'app e  riprovare');// - scaricamento dal server');
                    setShowAlert2(true);
                    // fetchRemoteMaps().then(remoteMaps => {
                    //   setMapsList(remoteMaps);
                    // });
                }
              },
              (error) =>
              {
                console.log('Problema nella ricezione dei dati sulle mappe - riavviare l\'app e riprovare ',error);
                setShowAlert2(true);
              }
            );
        }
      });
    }
  }

  // fetch the list of maps from server
  async function fetchRemoteMaps():Promise<[any]|null>
  {
    return new Promise(function(resolve,reject)
    {
      // load maps from server
      const url = `https://www.portolanodelpo.it/poServer/poServer.php?act=2&h=gkzLoFk0MN58TGqCJj`;
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            if (result.content)
            {
              // console.log('Informazioni sulle mappe scaricarte dal server.');
              localStore.set('mapslist', result.content);
              resolve(result.content);
            }
            else
            {
              // console.log('Problema nella ricezione dei dati sulle mappe - controlliamo se ce ne sono in memoria: ');
              setLoadingText('Problema nella ricezione dei dati sulle mappe - controlliamo se ce ne sono in memoria');
              // setShowAlert2(true);
              resolve(null);
            }
          },
          (error) => {
            // console.log('Problema nella ricezione dei dati sulle mappe - controlliamo se ce ne sono in memoria ',error);
            setLoadingText('Problema nella ricezione dei dati sulle mappe - controlliamo se ce ne sono in memoria');
            // setShowAlert2(true);
            resolve(null);
          }
      );
    });
  }



  // 1 second loop until it gets populated??
  // observer on coords and mapslist?
  function getClosestMap()
  {
    console.log("getClosestMap :: 1");
    if (mapsList != null && mapsList.length > 0) // if we've got maps list
    {
      console.log("getClosestMap :: 2 mapsList.length = "+mapsList.length);
      if (userCoords != null) // if we've got user coords
      {
        console.log("getClosestMap :: 3 userCoords lat = "+userCoords.latitude);
        let sumDistsances = 100;
        let chosenMap = -1;
        // mapsList.map((map, index) => {
        //   // compare distances from user position by calculating x and y distances and then summing them together. This will give me the ranking of distances.
        //   const thisXDistance = Math.abs(userCoords.latitude - map.lat)
        //   const thisYDistance = Math.abs(userCoords.longitude - map.lng)
        //   if ((thisXDistance + thisYDistance) < sumDistsances)
        //   {
        //     chosenMap = index;
        //     console.log("getClosestMap :: 4 chosing map with index = "+index);
        //   }
        // });

        // url to WMS service
        const surroundingMapUrl = "https://geomap.reteunitaria.piemonte.it/ws/siti/aipo-01/sitiwms/wms_aipo_CT_bacinopo?version=1.3.0&service=WMS&request=GetMap&width=2048&height=1524&transparent=true&STYLE=default&format=image/png&CRS=EPSG:32632&layers=AIPO-CTBacinoPo&bbox=";
        // bb coordinates
        let bbx1 = userCoords.latitude - 0.02;
        let bby1 = userCoords.longitude - 0.02;
        let bbx2 = userCoords.latitude + 0.02;
        let bby2 = userCoords.longitude + 0.02;

        console.log(`getClosestMap :: 4 about to fetch conversion ${bbx1},${bby1}, ${bbx2},${bby2}`);

        // now need to convert the coordinates
        fetch(`https://epsg.io/trans?x=${bby1}&y=${bbx1}&s_srs=4326&t_srs=32632`)
          .then(res => res.json())
          .then(
            (result) => {
              console.log("getClosestMap :: 5 about to fetch second req", result);
              fetch(`https://epsg.io/trans?x=${bby2}&y=${bbx2}&s_srs=4326&t_srs=32632`)
                .then(res => res.json())
                .then(
                  (result2) => {
                    console.log("getClosestMap :: 6 got second req", result2);
                    const finalUrl = surroundingMapUrl+result.x+","+result.y+","+result2.x+","+result2.y;
                    setSurroundingMap(finalUrl);
                    console.log("getClosestMap :: 9 closest map set as "+finalUrl);
                  },
                  (error) => {
                    console.log("getClosestMap :: 7 error!!", error);
                  });
            },
            (error) => {
              console.log("getClosestMap :: 8 error!!", error);
            });
      }
    }
  }


  useEffect(() => {
    fetchMaps();
    //getClosestMap();
   }, [mapsList, userCoords]); // empty dependency array to call userEffect() only once, onload.


     return (
       <IonPage>
         <IonHeader>
           <InnerMenu name={pageName} />
         </IonHeader>
         <IonContent fullscreen>
           <IonItem lines="none">
             <h1 className="mainTit" slot="start">{pageName}</h1>
           </IonItem>
           {surroundingMap != null && false && // commented for now
             <IonItem lines="none">
               <h2 className="" slot="start">Mappa dei dintorni</h2>
               <IonButton href={`${surroundingMap}`} fill="clear" size="large">
                 <IonIcon slot="end" icon={enterOutline} class="ion-padding" size="medium"/>
               </IonButton>
             </IonItem>
           }
           {/* while loading */}
           {mapsList == null &&
             <div>{loadingText}</div>
           }
           {/* if loading went fine */}
           {mapsList != null && mapsList.length > 0 &&
               <ListItems name={pageName} elements={mapsList} />
           }
         </IonContent>
         <IonAlert
           header={'Errore di recupero dati'}
           isOpen={showAlert2} message="C'è stato un problema nel recupero dei dati sulle mappe! Per favore riavvia l'app e riprova." buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert2(false)} />
         <GpsSinglePointComponent setUserCoords={setUserCoords}/> {/* pass the setter function to the child so we maintain the state watcher */}
         <PageEventHandler pageIndex={4} dockIndex={0}/>
       </IonPage>
     );
   };



export default Maps;



/*

Need to convert from EPSG:4326 (dal gps del telefono) to EPSG:32632
from: 45.068962, 9.715240 [che sarebbe 45°04'08.3"N 9°42'54.9"E]
to: 4990861.20, 556304.97

posso usare questo servizio:
GET: https://epsg.io/trans?x=9.71525&y=45.06897222222223&s_srs=4326&t_srs=32632
Risposta: {"y": "4990861.20", "x": "556304.97", "z": "0.00"}

GET funzionante le loro WMS [mancano layers e bounding box]
https://geomap.reteunitaria.piemonte.it/ws/siti/aipo-01/sitiwms/wms_aipo_CT_bacinopo?version=1.3.0&service=WMS&request=GetMap&width=2048&height=1524&transparent=true&STYLE=default&format=image/png&CRS=EPSG:32632

// mappa di tutto il PO
&layers=AIPO-CTBacinoPo&bbox=279845,4773990,832271,5255940
// area sopra piacenza
&layers=AIPO-CTBacinoPo&bbox=554392.77,4988915.82,556304.97,4990861.20

Tutte le capabilities dell' WMS
http://geomap.reteunitaria.piemonte.it/ws/siti/aipo-01/sitiwms/wms_aipo_CT_bacinopo?service=WMS&request=getCapabilities

pagina con elenco servizi disponibili
http://geoportale.agenziapo.it/web/index.php/it/dati-disponibili

pagina con elenco Mappe
https://www.adbpo.it/download/CartaPo10k_edizione2008/CartaPo10k_Tavole_pdf/?C=M;O=D




10K_PO21_08_REA.pdf
top left:  45.183051, 9.134746
bottom right: 45.172860, 9.172393


10K_PO22_08_FOCE_TICINO.pdf
top left: 45.172860, 9.172393
bottom right: 45.115780, 9.273801

10K_PO23_08_ARENA_PO
top left: 45.146004, 9.273776
bottom right:





CARTA DEL FIUME PO Tavola 24 - Pieve Porto Morone
CARTA DEL FIUME PO Tavola 25 - Boscone Cusani
CARTA DEL FIUME PO Tavola 26 - Piacenza Ovest
CARTA DEL FIUME PO Tavola 27 - Piacenza Est
CARTA DEL FIUME PO Tavola 28 - Foce Nure
CARTA DEL FIUME PO Tavola 29 - Isola Serafini
CARTA DEL FIUME PO Tavola 30 - Cremona
CARTA DEL FIUME PO Tavola 31 - Foce Ongina
CARTA DEL FIUME PO Tavola 32 - Isola Pescaroli
CARTA DEL FIUME PO Tavola 33 - Foce Taro
top left:  45.058016, 10.242388
bottom right: 44.961368, 10.341936
CARTA DEL FIUME PO Tavola 34 - Casalmaggiore
top left: 45.015294, 10.341936
bottom right: 44.919367, 10.441958

CARTA DEL FIUME PO Tavola 35 - Viadana
CARTA DEL FIUME PO Tavola 36 - Guastalla
CARTA DEL FIUME PO Tavola 37 - Luzzara
CARTA DEL FIUME PO Tavola 38 - Foce Oglio
CARTA DEL FIUME PO Tavola 39 - Borgoforte
CARTA DEL FIUME PO Tavola 40 - San Benedetto Po
CARTA DEL FIUME PO Tavola 41 - Ostiglia
CARTA DEL FIUME PO Tavola 42 - Carbonara
CARTA DEL FIUME PO Tavola 43 - Sermide
CARTA DEL FIUME PO Tavola 44 - Foce Panaro
CARTA DEL FIUME PO Tavola 45 - Pontelagoscuro
CARTA DEL FIUME PO Tavola 46 - Polesella
CARTA DEL FIUME PO Tavola 47 - Crespino
  CARTA DEL FIUME PO Tavola 48 - Berra


*/
