import { IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonAlert, IonItem, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonPopover, IonList, IonLabel, IonAccordion, IonAccordionGroup } from '@ionic/react';
import { Storage } from '@ionic/storage';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import GpsSinglePointComponent from '../components/GpsSinglePointComponent';
import { mapOutline, enterOutline } from 'ionicons/icons'
import {localStore} from '../App';
import PageEventHandler from "../components/PageEventHandler"
import './Docks.css';
import {lookAtDistance} from "../js/dockDistanceCalculator.js";

const Docks: React.FC = () => {

  const pageName = "Attracchi";
  const [showAlert2, setShowAlert2] = useState(false);
  const [docksList, setDocksList] = useState<[any] | null>(null);
  const [loadingText, setLoadingText] = useState('Caricamento Attracchi...');
  const [closestDock, setClosestDock] = useState<number|null>(null);
  // this will be set in GpsSinglePointComponent
  const [userCoords, setUserCoords] = useState<any|null>(null)
  const [dock1, setDock1] = useState<any|null>(null)
  const [dock2, setDock2] = useState<any|null>(null)
  const [docksDistance, setDocksDistance] = useState('-');

  // fetch the list of docks from memory - if none fetch it from server - or return an empty array
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
                    console.log('Non sono presenti informazioni sugli attracchi in memoria - riavviare l\'app e  riprovare');
                    setLoadingText('Non sono presenti informazioni sugli attracchi in memoria - riavviare l\'app e  riprovare');
                    setShowAlert2(true);
                }
              },
              (error) =>
              {
                console.log('Problema nella ricezione dei dati sugli attracchi - riavviare l\'app e riprovare ',error);
                setShowAlert2(true);
              }
          );
        }
      });
    }
  }

  // fetch the list of docks from server
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
            console.log('Informazioni sugli attracchi scaricarte dal server.');
            localStore.set('dockslist', result.content);
            resolve(result.content);
          },
          (error) => {
            console.log('Problema nella ricezione dei dati sugli attracchi - controlliamo se ce ne sono in memoria ',error);
            setLoadingText('Problema nella ricezione dei dati sugli attracchi - controlliamo se ce ne sono in memoria');
            // setShowAlert2(true);
            resolve(null);
          }
      );
    });
  }

  // 1 second loop until it gets populated??
  // observer on coords and dockslist?
  function getClosestDock()
  {
    // console.log("getClosestDock :: 1");
    if (docksList != null && docksList.length > 0) // if we've got docks list
    {
      // console.log("getClosestDock :: 2 docksList.length = "+docksList.length);
      if (userCoords != null) // if we've got user coords
      {
        // console.log("getClosestDock :: 3 userCoords lat = "+userCoords.latitude+", "+userCoords.longitude);
        let sumDistsances = 100;
        let chosenDock = -1;
        docksList.map((dock, index) => {
          // compare distances from user position by calculating x and y distances and then summing them together. This will give me the ranking of distances.
          const thisXDistance = Math.abs(userCoords.latitude - dock.lat)
          const thisYDistance = Math.abs(userCoords.longitude - dock.lng)
          // console.log("getClosestDock :: 3.1 dock coord: "+dock.lat+","+dock.lng+" old distance = "+sumDistsances+" VS "+(thisXDistance + thisYDistance)+" = new distance");
          if ((thisXDistance + thisYDistance) < sumDistsances)
          {
            chosenDock = index;
            sumDistsances = thisXDistance + thisYDistance;
            // console.log("getClosestDock :: 4 chosing dock with index = "+index);
          }
        });
        setClosestDock(chosenDock);
        // console.log("getClosestDock :: 5 closest dock set as "+chosenDock+" --> "+closestDock);
      }
    }
  }

  function calculateDocksDistance()
  {
    if (dock1 != null && dock2 != null)
    {
      // convert dock2's object in a usable object (latitude, longitude)
      // this is needed to be able to use the same function also to process user coordinates
      let usableDock2 = {latitude: dock2.lat, longitude: dock2.lng};
      setDocksDistance(lookAtDistance(dock1, usableDock2));
    }
  }

  useEffect(() => {
    fetchDocks();
    getClosestDock();
    calculateDocksDistance();
  }, [docksList, userCoords, dock1, dock2]);


  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start">{pageName}</h1>
          {/* commented for now as redundant
          <IonButton slot="end" href="/docksMap" fill="clear" size="large">
            <IonIcon icon={mapOutline}></IonIcon>
          </IonButton>
          */}
        </IonItem>
        {closestDock != null &&
          <IonItem lines="none">
            <h2 className="" slot="start">Attracco più vicino</h2>
            <IonButton href={`/dock/${closestDock}`} fill="clear" size="large">
              <IonIcon slot="end" icon={enterOutline} class="ion-padding" size="medium"/>
            </IonButton>
          </IonItem>
        }
        {/* while loading */}
        {docksList == null &&
          <div>{loadingText}</div>
        }
        {/* if loading went fine */}
        {docksList != null && docksList.length > 0 &&
          <>
            <IonAccordionGroup>
              <IonAccordion value="legend">
                <IonItem slot="header">
                  Calcola la distanza tra due attracchi
                </IonItem>
                <IonGrid slot="content">
                  <IonRow>
                    <IonCol key="1" size="5">
                      <IonButton id="start-trigger">Partenza</IonButton>
                      <IonPopover trigger="start-trigger" size="auto" side="top" className="popupContentStart" dismissOnSelect>
                        <IonList className="listsContent">
                          {docksList.map((element, key) =>
                            <IonItem key={key} button={true} onClick={()=>{setDock1(element)}}>{element.name}</IonItem>
                          )}
                        </IonList>
                      </IonPopover>
                    </IonCol>
                    <IonCol key="2" size="7">
                      {dock1 != null ? dock1.name : "-"}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol key="1" size="5">
                      <IonButton id="end-trigger">Arrivo</IonButton>
                      <IonPopover trigger="end-trigger" size="auto" side="top" className="popupContentEnd" dismissOnSelect>
                        <IonList className="listsContent">
                            {docksList.map((element, key) =>
                              <IonItem key={key} button={true} onClick={()=>{setDock2(element); }}>{element.name}</IonItem>
                            )}
                        </IonList>
                      </IonPopover>
                    </IonCol>
                    <IonCol key="2" size="7">
                      {dock2 != null ? dock2.name : "-"}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol key="1" size="5">
                      <p>&nbsp;Distanza : </p>
                    </IonCol>
                    <IonCol key="2" size="7">
                      <p>{docksDistance != null ? docksDistance : "-"}</p>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonAccordion>
            </IonAccordionGroup>
            <ListItems name={pageName} elements={docksList} />
          </>
        }
      </IonContent>
      <IonAlert
        header={'Errore di recupero dati'}
        isOpen={showAlert2} message="C'è stato un problema nel recupero dei dati sugli attracchi! Per favore riavvia l'app e riprova." buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert2(false)} />
      <GpsSinglePointComponent setUserCoords={setUserCoords}/> {/* pass the setter function to the child so we maintain the state watcher */}
      <PageEventHandler pageIndex={2} dockIndex={0}/>
    </IonPage>
  );
};

export default Docks;
