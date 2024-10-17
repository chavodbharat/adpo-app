import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonIcon, IonItem, IonAlert} from '@ionic/react';
import { useParams } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import React, { useRef, useState, useEffect } from 'react';
import { useIonViewDidEnter, useIonViewDidLeave, isPlatform } from '@ionic/react'
import { PluginListenerHandle, Plugins } from '@capacitor/core'
import PageEventHandler from "../components/PageEventHandler"
import {appVersion} from '../App';

const Home: React.FC = () => {

  const backButtonListenerHandle = useRef<PluginListenerHandle>()
  const [versionNumber, setVersionNumber] = useState('0.0');
  const [showVersionAlert, setShowVersionAlert] = useState(false);

    useIonViewDidEnter(() => {
      backButtonListenerHandle.current = Plugins.App.addListener(
        'backButton',
        Plugins.App.exitApp
      )
    })

    useIonViewDidLeave(() => {
      if (backButtonListenerHandle.current) {
        backButtonListenerHandle.current.remove()
        backButtonListenerHandle.current = undefined
      }
    })


    // load app version number from server
    async function fetchAppVersion()
    {
      return new Promise(function(resolve,reject)
      {
        const url = `https://www.portolanodelpo.it/poServer/poServer.php?act=7&h=gkzLoFk0MN58TGqCJj`;
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              setVersionNumber(result.content);
              if (result.content != appVersion)
              {
                setShowVersionAlert(true);
              }

              resolve(result.content);
            },
            (error) => {
              console.log('Problema nella ricezione dei dati sulla versione dell\'app: ',error);
                setShowVersionAlert(false);
              // do not give allarming feedback to the user - die silently
              resolve(null);
            }
        );
      });
    }

    // handler for the alert-update button
    function updateBtnHandler()
    {
      if (isPlatform('ios'))
      {
        window.open("https://apps.apple.com/it/app/portolano-del-po/id1624054764");
      }
      else
      {
        window.open("https://play.google.com/store/apps/details?id=art.acma.portolanopo");
      }
    }

    useEffect(() => {
      fetchAppVersion();
    },[versionNumber]);

  const pageName = "Benvenuti a Po";
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonImg class="toolbarImages ion-margin" slot="start" alt="Logo portolano del Po" src="assets/images/PortolanoPo-28.png" />
          <IonButtons slot="end">
            <IonMenuButton>
              <IonIcon src="./assets/images/portolanoPo-menu.svg"></IonIcon>
            </IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit">Benvenuti</h1>
        </IonItem>
        <ExploreContainer />
        <IonAlert
          header={'Aggiornamento app consigliato'}
          isOpen={showVersionAlert} message="Per restare al passo con le migliorie e i servizi aggiorna subito l'app del Portolano del Po!"
          onDidDismiss={() => setShowVersionAlert(false)}
          buttons={[{ text: 'Più tardi' },{ text: 'Aggiorna', handler: () => { updateBtnHandler(); },}]}
          />
      </IonContent>
      <PageEventHandler pageIndex={0} dockIndex={0}/>
    </IonPage>
  );
};

export default Home;
