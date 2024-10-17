import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton ,IonIcon, IonItem, IonText } from '@ionic/react';
import { useParams } from 'react-router-dom';
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import PageEventHandler from "../components/PageEventHandler"
import './Bridges.css';

const Bridges: React.FC = () => {

const pageName = "Ponti e Conche";
const pageBridgesUrl = "https://www.agenziapo.it/content/ponti-e-conche";
const pageVenetoUrl = "https://infonavigazione.infrastrutturevenete.it/infonavigazione/index.php";



  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start">{pageName}</h1>
        </IonItem>
        <div className="ion-padding ion-text-justify">
          Controlla la situazione di Ponti e Conche di navigazione, aggiornata quotidianamente da AIPO.
        </div>
        <IonButton target="_blank" rel="noreferrer" href={pageBridgesUrl} expand="block" fill="solid" className="ion-padding bridgeBtn">
         Controlla la situazione di<br />Ponti e Conche sul sito di AIPo
        </IonButton>
        <IonButton target="_blank" rel="noreferrer" href={pageVenetoUrl} expand="block" fill="solid" className="ion-padding bridgeBtn">
         Regione Veneto<br />Informazioni sulle linee navigabili
        </IonButton>
      </IonContent>
      <PageEventHandler pageIndex={9} dockIndex={0}/>
    </IonPage>
  );
};

export default Bridges;
