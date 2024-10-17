import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonAlert, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonItem } from '@ionic/react';
import { useParams } from 'react-router-dom';
import InnerMenu from '../components/InnerMenu';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Storage } from '@ionic/storage';
import { locationOutline } from 'ionicons/icons'
import {localStore, deviceId} from '../App';
import PageEventHandler from "../components/PageEventHandler"
import GpsSinglePointComponent from '../components/GpsSinglePointComponent';
import './Dock.css';
import JsonRoutes from "../json_routes/pavia-voltagrimana.json";
import {lookAtDistance} from "../js/dockDistanceCalculator.js";

const Dock: React.FC = (props) => {

  const pageName = "Attracco";
  // get query parameter
  const { id } = useParams<{ id: string; }>();
  const [thisDock, setThisDock] = useState<any | null>(null);
  const [loadingText, setLoadingText] = useState('Caricamento Attracco...');
  const [showAlert2, setShowAlert2] = useState(false);
  const [thisDockDistance, setThisDockDistance] = useState('Calcolo...');
  // this will be set in GpsSinglePointComponent
  const [userCoords, setUserCoords] = useState<any|null>(null);

  // get the list from local storage or network, then extract our dock
  async function getThisDockFromList()
  {
    if (thisDock == null)
    {
      await localStore.get("dockslist")
        .then(
          (docks) =>
          {
            if (docks != null)
            {
              setThisDock(docks[id]);
            }
            else
            {
              console.log('Non sono presenti informazioni sugli attracchi in memoria - scaricamento dal server');
              setLoadingText('Non sono presenti informazioni sugli attracchi in memoria - scaricamento dal server');
              fetchRemoteDocks().then(remoteDocks =>
                {
                  setThisDock(docks[id]);
                });
            }
        },
        (error) =>
        {
          console.log('Problema nella ricezione dei dati sugli attracchi: ',error);
        }
      );
    }
  }

  async function fetchRemoteDocks()
  {
    return new Promise(function(resolve,reject)
    {
      // load docks from server
      const url = `https://www.portolanodelpo.it/poServer/poServer.php?act=1&h=gkzLoFk0MN58TGqCJj`;
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            // setDocksList(result.content);
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


  useEffect(() => {
    getThisDockFromList();
    setThisDockDistance(lookAtDistance(thisDock, userCoords));
  }, [thisDock, userCoords]); // empty dependency array t

  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
      {/* while loading */}
      {thisDock == null &&
        <div>{loadingText}</div>
      }
      {/* if loading went fine */}
      {thisDock != null &&
        <div>
          <IonItem lines="none">
            <h1 className="mainTit" slot="start">{thisDock.name}</h1>
          </IonItem>
          <IonGrid className="ion-padding">
            <IonRow>
              <IonCol size="10"><h2>{thisDock.village}, {thisDock.postcode} {thisDock.city}</h2></IonCol>
              <IonCol size="2" >
                <IonButton href={`/docksMap/${id}`} fill="clear" size="large" class="ion-no-padding">
                 <IonIcon icon={locationOutline} className="dockButton" ></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="4" className="colTit">Distanza attuale: </IonCol>
              <IonCol>{thisDockDistance}</IonCol>
            </IonRow>
            {thisDock.phone_fixed != '' &&
            <IonRow>
              <IonCol size="4" className="colTit">Telefono Fisso: </IonCol>
              <IonCol><a href={`tel:${thisDock.phone_fixed}`}>{thisDock.phone_fixed}</a></IonCol>
            </IonRow>
            }
            {thisDock.phone_mobile != '' &&
            <IonRow>
              <IonCol size="4" className="colTit">Telefono Cellulare: </IonCol>
              <IonCol><a href={`tel:${thisDock.phone_mobile}`}>{thisDock.phone_mobile}</a></IonCol>
            </IonRow>
            }
            <IonRow>
              <IonCol size="4" className="colTit">Posti barca: </IonCol>
              <IonCol>{thisDock.boat_spaces}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="4" className="colTit">Tipo di attracco: </IonCol>
              <IonCol>
              {thisDock.dockTypes.map((element:any, index:any) => {
                return (
                  <span key={index}>{element.name}<br /></span>
                  )
                })
              }
              </IonCol>
            </IonRow>
            {thisDock.services_public != '' &&
            <IonRow>
              <IonCol size="4" className="colTit">Servizi pubblici: </IonCol>
              <IonCol>{thisDock.services_public}</IonCol>
            </IonRow>
            }
            {thisDock.services_members != '' &&
            <IonRow>
              <IonCol size="4" className="colTit">Servizi ai soci: </IonCol>
              <IonCol>{thisDock.services_members}</IonCol>
            </IonRow>
            }
            {thisDock.description != '' &&
            <IonRow>
              <IonCol size="4" className="colTit">Descrizione: </IonCol>
              <IonCol>{thisDock.description}</IonCol>
            </IonRow>
            }
            {thisDock.restaurants != '' &&
            <IonRow>
              <IonCol size="4" className="colTit">Ristoranti: </IonCol>
              <IonCol>{thisDock.restaurants}</IonCol>
            </IonRow>
            }
            {thisDock.hotels != '' &&
            <IonRow>
              <IonCol size="4" className="colTit">Alberghi: </IonCol>
              <IonCol>{thisDock.hotels}</IonCol>
            </IonRow>
            }
            {thisDock.picture &&
            <IonRow>
              <IonCol size="12" className="colTit">
                <IonImg src={`https://www.portolanodelpo.it/poServer/docks_img/${thisDock.picture}`} />
              </IonCol>
            </IonRow>
            }
          </IonGrid>
        </div>
      }
      </IonContent>
      <IonAlert
        header={'Errore di recupero dati'}
        isOpen={showAlert2} message="C'è stato un problema nel recupero dei dati sugli attracchi! Per favore riavvia l'app e riprova." buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert2(false)} />
      <PageEventHandler pageIndex={3} dockIndex={+id+1}/>
      <GpsSinglePointComponent setUserCoords={setUserCoords}/> {/* pass the setter function to the child so we maintain the state watcher */}
    </IonPage>
  );
};

export default Dock;
