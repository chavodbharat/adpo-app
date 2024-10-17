import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonItem, IonAlert, IonLabel, IonIcon, IonButton } from '@ionic/react';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import {localStore} from '../App';
import PageEventHandler from "../components/PageEventHandler"
import './Islands.css';

const Islands: React.FC = () => {

const pageName = "Isole naturalistiche e Rete Natura 2000";
const [showAlert2, setShowAlert2] = useState(false);
const [islandsData, setIslandsData] = useState<[any] | null>(null);
const [loadingText, setLoadingText] = useState('Caricamento Aree naturalistiche e isole...');

// fetch the list of docks from memory - if none fetch it from server - or return an empty array
async function fetchIslands()
{
  if (islandsData == null)
  {
    await localStore.get("islandsData")
      .then(
        (islands) =>
        {
          if (islands != null)
          {
            console.log('Informazioni sulle aree naturalistiche presenti in memoria.');
            setIslandsData(islands);
          }
          else
          {
              console.log('Non sono presenti informazioni sulle aree naturalistiche in memoria - scaricamento dal server');
              setLoadingText('Non sono presenti informazioni sulle aree naturalistiche in memoria - scaricamento dal server');
              fetchRemoteIslands().then(remoteIslands => {
                setIslandsData(remoteIslands);
              });
          }
        },
        (error) =>
        {
          console.log('Problema nella ricezione dei dati sulle aree naturalistiche: ',error);
        }
      );
    }
  }

  // fetch the list of docks from server
  async function fetchRemoteIslands():Promise<[any]|null>
  {
    return new Promise(function(resolve,reject)
    {
      // load docks from server
      const url = `https://www.portolanodelpo.it/poServer/poServer.php?act=4&h=gkzLoFk0MN58TGqCJj`;
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            localStore.set('islandsData', result.content);
            resolve(result.content);
          },
          (error) => {
            console.log('Problema nella ricezione dei dati sulle aree naturalistiche: ',error);
            setLoadingText('Problema nella ricezione dei dati sulle aree naturalistiche - riavviare l\'app e  riprovare');
            setShowAlert2(true);
            resolve(null);
          }
      );
    });
  }


  useEffect(() => {
    fetchIslands();
  }, [islandsData]);

  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start" >{pageName}</h1>
        </IonItem>
        <IonButton href="/islandsMap" expand="block" fill="solid" className="ion-padding reg-islBtn" >
          Guarda la Rete Natura 2000 <br /> sulla mappa
        </IonButton>

        {/* while loading */}
        {islandsData == null &&
          <div>{loadingText}</div>
        }
        {/* if loading went fine */}
        {/* these links are not needed anymore - but leaving the code here just in case
        {islandsData != null && islandsData.length > 0 &&
          <div className="ion-padding ion-text-center">
          {islandsData.map((element, index) => {
            return (
              <span key={index}>
                {element.province == null && // show only elements not in the array
                   <IonButton target="_blank" rel="noreferrer" href={element.url} expand="block" fill="solid" className="ion-padding reg-islBtn" size="large">
                    {element.region_name}<br />{element.title}
                   </IonButton>
                }
              </span>
            )
          })}
          </div>
        }
        */}
        {islandsData != null && islandsData.length > 0 &&
          <ListItems name={pageName} elements={islandsData} />
        }
      </IonContent>
      <IonAlert
        header={'Errore di recupero dati'}
        isOpen={showAlert2} message="C'è stato un problema nel recupero dei dati sulle aree naturalistiche e le isole! Per favore riavvia l'app e riprova." buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert2(false)} />
        <PageEventHandler pageIndex={5} dockIndex={0}/>
    </IonPage>
  );
};

export default Islands;
