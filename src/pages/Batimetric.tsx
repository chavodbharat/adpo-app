import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton ,IonIcon, IonItem, IonText } from '@ionic/react';
import { useParams } from 'react-router-dom';
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import React, {useEffect, useState } from 'react';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem'; // currently not used
import { Browser } from '@capacitor/browser';
import PageEventHandler from "../components/PageEventHandler"
import './Batimetric.css';

const Batimetric: React.FC = () => {

const pageName = "Bollettini e Avvisi alla navigazione";
const pageUrl = "https://www.agenziapo.it/content/bollettino-giornaliero";
const pageAlertUrl = "https://www.agenziapo.it/elenco_avvisi_navigazione";
const pageWaterMonitorUrl = "https://www.agenziapo.it/content/monitoraggio-idrografico-0";
// es report full url https://www.agenziapo.it/sites/default/files/bollettinipdf/Bollettino2022-04-27.pdf
const reportBaseUrl = "https://www.agenziapo.it/sites/default/files/bollettinipdf/Bollettino";
const [reportDateBit, setReportDateBit] = useState("");


const showPdf = async () => {
  await Browser.open({ url: 'https://www.agenziapo.it/sites/default/files/dwd/attivita/navigazione_interna/segnaletica/regolamento_segnaletica.pdf'});
  console.log('Doc aperto in browser');
};


  // call function to retrieve the device UUID
  useEffect(() => {
    const d = new Date();
    const month = d.getMonth() + 1;
    const stringMonth = month < 10 ? "0"+month : ""+month;
    const stringDay = d.getDate() < 10 ? "0"+d.getDate() : ""+d.getDate();
    setReportDateBit(`${d.getFullYear()}-${stringMonth}-${stringDay}`);
  }, []);



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
          Consulta il Bollettino dei fondali e degli idrometri oltre ad altre importanti informazioni dal sito web AIPO
        </div>
        <IonButton target="_blank" rel="noreferrer" href={`${reportBaseUrl}${reportDateBit}.pdf`} expand="block" fill="solid" className="ion-padding ruleBtn">
         Scarica il<br />bollettino batimetrico<br />odierno in formato PDF
        </IonButton>
        <IonButton target="_blank" rel="noreferrer" href={pageWaterMonitorUrl} expand="block" fill="solid" className="ion-padding ruleBtn">
         Apri il monitoraggio<br />idrografico Interattivo<br />sul sito di AIPo
        </IonButton>
        <IonButton target="_blank" rel="noreferrer" href={pageUrl} expand="block" fill="solid" className="ion-padding ruleBtn">
         Controlla il<br />bollettino batimetrico<br />sul sito di AIPo
        </IonButton>
        <IonButton target="_blank" rel="noreferrer" href={pageAlertUrl} expand="block" fill="solid" className="ion-padding ruleBtn">
         Consulta gli<br />avvisi di navigazione<br />sul sito di AIPo
        </IonButton>
      </IonContent>
      <PageEventHandler pageIndex={7} dockIndex={0}/>
    </IonPage>
  );
};

export default Batimetric;
