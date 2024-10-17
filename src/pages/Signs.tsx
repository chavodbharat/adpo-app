import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonItem, IonText, IonList, IonLabel, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { Browser } from '@capacitor/browser';
import PageEventHandler from "../components/PageEventHandler"
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import './Signs.css';

const Signs: React.FC = () => {

  const pageName = "Segnaletica e Regolamento";
  let signs: [any] = [''];
  const rulebookUrl = "https://www.agenziapo.it/sites/default/files/dwd/attivita/navigazione_interna/segnaletica/regolamento_segnaletica.pdf";


  const showPdf = async () => {
    // await Browser.open({ url: '/assets/docs/regolamento_segnaletica.pdf'});
    await Browser.open({ url: 'https://www.agenziapo.it/sites/default/files/dwd/attivita/navigazione_interna/segnaletica/regolamento_segnaletica.pdf'});
    console.log('Doc aperto in browser');
  };

  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start">{pageName}</h1>
        </IonItem>
        <IonItem lines="none">
          <h2 className="subTit" slot="start">Norme di circolazione e Segnaletica Fluviale</h2>
        </IonItem>
        <div className="ion-padding">
          <div className="ion-text-justify">
            Per una corretta e sicura navigazione bisogna conoscere e rispettare tutte le segnalazioni situate sulla sponda del fiume o sull'acqua. Spesso la traiettoria o rotta del canale navigabile, non corrisponde alla forma dei meandri ma segue alcuni principi relativi al deposito e all’erosione di sabbie e ghiaie dei fiumi, pertanto, è individuabile attraverso una segnaletica particolare situata sulle sponde del fiume in grado di guidare i natanti che lo percorrono evitando loro di arenarsi sui banchi di sabbia e di ghiaia.
            <br/ ><br />
            Per una migliore comprensione dell'utilizzo e dell'interpretazione si consiglia di consultare le norme di riferimento:&nbsp;
            {/*<a href="https://www.agenziapo.it/sites/default/files/dwd/attivita/navigazione_interna/segnaletica/regolamento_segnaletica.pdf" target="_blank">REGOLAMENTO DELLA SEGNALETICA</a>*/}
          </div>
          <IonButton target="_blank" rel="noreferrer" href={rulebookUrl} expand="block" fill="solid" className="ion-padding signBtn">
           Scarica il regolamento<br /> in formato PDF
          </IonButton>

          <br />
          <div className="ion-margin-top">
            <h3>Alcune indicazioni generali</h3>
          </div>

          <div className="ion-text-justify">
          Per navigare in sicurezza sul fiume Po occorre seguire determinati tragitti d’allineamento, dirigendo la prora verso la segnaletica predisposta lungo la sponda; si tratta di quattro segnali di sponda con significato di chiamata, rimando, chiamata e rimando, prosecuzione
          </div>
        </div>

        <IonList>
          <IonItem key="1" button={false}>
            <IonImg className="ion-margin img-square" slot="start" alt="Segnale 1" src="assets/images/sign-1.png" />
            <p className="ion-padding-start"><b>Segnale di chiamata</b>: Dirigersi verso la sponda dove si trova il segnale</p>
          </IonItem>
          <IonItem key="2" button={false}>
            <IonImg class="ion-margin img-square" slot="start" alt="Segnale 2" src="assets/images/sign-2.png" />
            <p className="ion-padding-start"><b>Segnale di rimando</b>: Abbandonare la sponda dove si trova il segnale</p>
          </IonItem>
          <IonItem key="3" button={false}>
            <IonImg class="ion-margin img-square" slot="start" alt="Segnale 3" src="assets/images/sign-3.png" />
            <p className="ion-padding-start"><b>Segnale Tocca-Scappa</b>: Dirigersi verso la sponda e abbandonarla immediatamente dopo averla raggiunta</p>
          </IonItem>
          <IonItem key="4" button={false}>
            <IonImg class="ion-margin img-square" slot="start" alt="Segnale 4" src="assets/images/sign-4.png" />
            <p className="ion-padding-start"><b>Segnale di prosecuzione</b>: Proseguire lungo la sponda dove si trova il segnale fino ad avviso successivo</p>
          </IonItem>
        </IonList>

        <IonItem lines="none" className="ion-margin-top">
          <h4>Segnali per indicare la rotta verso i ponti ed ostacoli</h4>
        </IonItem>

        <IonList>
          <IonItem key="5" button={false}>
            <IonImg className="ion-margin img-tall" slot="start" alt="Segnale 5" src="assets/images/sign-5.jpg" />
            <p className="ion-padding-start"><b>Boa Bianca</b> deve essere lasciata a sinistra in discesa e a destra in risalita</p>
          </IonItem>
          <IonItem key="6" button={false}>
            <IonImg className="ion-margin img-tall" slot="start" alt="Segnale 6" src="assets/images/sign-6.jpg" />
            <p className="ion-padding-start"><b>Boa Rossa</b> deve essere lasciata a destra in discesa e a sinistra in risalita</p>
          </IonItem>
          <div key="7" className="ion-padding">
            <IonImg className="ion-margin img-wide" slot="start" alt="Navigazione" src="assets/images/sign-8.jpg" />
          </div>
          <div key="8" className="ion-padding">
            <IonImg className="ion-margin img-wide" slot="start" alt="Segnali ponti" src="assets/images/sign-7.jpg" />
            <br />
            <p className="ion-text-justify"><b>la luce gialla fissa</b>: serve per indicare, nei momenti di scarsa visibilità come nebbia, oscurità, ecc., la zona centrale, sede di transito.</p>
            <p className="ion-text-justify"><b>Un segnale rosso</b> viene posto sulla portiera d'apertura di ponti in barche Tabelloni bianchi con pittura fluorescente servono per aumentare la visibilità notturna</p>
          </div>
        </IonList>

        <div className="ion-padding ion-text-justify">
          <h4>Norme di Riferimento</h4>
          <h5>Norme Regionali (Per il Fiume Po in vigore segnaletica allegato 4 dei Regolamenti approvati):</h5>
          <ul>
            <li>Regione Emilia Romagna - Delibera Giunta regionale del 03/04/2002 n. 530 - Approvazione del regolamento della segnaletica e delle vie di navigazione interna</li>
            <li>Regione Piemonte - Regolamento regionale 7 giugno 2002, n. 6/R recante: "Regolamento della segnaletica e delle vie di navigazione interna fluviali"</li>
            <li>Regione Lombardia – Regolamento Regionale 26/09/2022 n.9 - Regolamento della segnaletica e delle vie di navigazione interna</li>
            <li>Regione Veneto - Regolamento regionale 20 dicembre 2002, n. 6{/* - <a href="http://ns-rasmedia.consiglioveneto.it/crvportal/leggi/2002/02rr0006.html" target="_blank">REGOLAMENTO DELLA SEGNALETICA E DELLE VIE DI NAVIGAZIONE INTERNA</a>*/}</li>
          </ul>
        </div>

      </IonContent>
      <PageEventHandler pageIndex={8} dockIndex={0}/>
    </IonPage>
  );
};

export default Signs;
