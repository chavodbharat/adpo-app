import { IonPage, IonHeader, IonContent, IonItem, IonImg} from '@ionic/react';
import InnerMenu from '../components/InnerMenu';
import PageEventHandler from "../components/PageEventHandler"
import './Credits.css';

const Credits: React.FC = () => {

const pageName = "Enti promotori";


  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start">{pageName}</h1>
        </IonItem>
        <div className="ion-text-justify ion-padding">
          <p>Una guida di navigazione per appassionati diportisti alla scoperta del fiume pi&ugrave; lungo d&rsquo;Italia, dei suoi paesaggi, dei suoi sapori e della sua cultura locale, attraversando le Riserve della Biosfera dal Ticino al Po Grande fino al Delta Po. Uno strumento utile per chi si approccia al fiume Po per la prima volta, per imparare a conoscerlo e navigarlo in sicurezza, ma anche per i pi&ugrave; esperti, per scoprire nuovi percorsi ed aiutarci a migliorare l&rsquo;app grazie all&rsquo;invio di segnalazioni utili.</p>
          <p>Questo progetto vuole essere un supporto su cui lavorare con lo scopo di porre attenzione sempre maggiore al fiume Po, per migliorare ed implementare una fruizione sostenibile del fiume ed un servizio di accoglienza che possa ospitare tutti gli appassionati diportisti, nel rispetto dell&rsquo;ambiente e delle normative vigenti. Il Portolano del Po, nasce nel contesto della Riserva MAB UNESCO Po Grande e dalla collaborazione tra <strong>Autorit&agrave; di Bacino Distrettuale del fiume Po (AdBPo)</strong> e <strong>Agenzia Interregionale per il fiume Po (AIPO)</strong>, con il prezioso contributo di Bruno Censi con l&rsquo;Associazione Motonautica di Venezia e al fondamentale supporto tecnico e grafico di ARTernative srl.</p>
          <p>Cosa contiene questa guida alla navigazione: informazioni sugli attracchi turistici disponibili, dove si trovano e come avvicinarli, sui servizi offerti in ciascun attracco (scivoli di alaggio, rifornimento carburante, acqua potabile, servizi igienici, parcheggi e altro ancora) oltre ad alcune note sui punti di interesse, le aree naturali attraversate lungo il Po, i ristoranti e gli alberghi pi&ugrave; vicini. Ogni attracco fornisce indicazioni su come raggiungere il successivo e, attraverso l&rsquo;applicazione, sar&agrave; possibile seguire il tracciato dell&rsquo;idrovia navigabile in sicurezza, prestando per&ograve; sempre attenzione alla segnaletica presente. Ricorda: Al&nbsp;comandante della nave, in modo esclusivo, spetta la direzione&nbsp;della&nbsp;manovra e&nbsp;della navigazione! Nell&rsquo;applicazione si possono trovare anche utili riferimenti al regolamento di navigazione e alla principale segnaletica che si incontra in traversata lungo il Po.</p>
          <p>
            Per gli esperti naviganti del Po sar&agrave; inoltre possibile, tramite applicazione, effettuare delle segnalazioni su criticit&agrave; o punti di interesse lungo il percorso, cos&igrave; da contribuire a migliorare ed implementare l&rsquo;app, oltre a creare un dialogo diretto tra utenti ed Enti competenti. Non resta che buttarsi all&rsquo;avventura del Grande Fiume e scoprire nuovi orizzonti!
          </p>
          <p>
            Scopri tutti progetti attivi sul fiume Po sui siti <a href="https://www.adbpo.it" target="_blank">www.adbpo.it</a>, <a href="https://www.agenziapo.it" target="_blank">www.agenziapo.it</a> e <a href="https://www.pogrande.it" target="_blank">www.pogrande.it</a> e sui canali social della <b>Riserva MAB UNESCO Po Grande</b>.
          </p>
        </div>
        <div className="footerBar">
          <a href="https://www.agenziapo.it" target="_blank"><IonImg class="ion-margin" slot="start" alt="Logo AIPO" src="assets/images/logo_aipo_b2.png" id="logoAipo" /></a>
          <a href="https://www.adbpo.it" target="_blank"><IonImg class="ion-margin" slot="start" alt="Logo ADBPO" src="assets/images/logo-adbpo-wide.png" id="logoAdbpo" /></a>
        </div>
      </IonContent>
      <PageEventHandler pageIndex={12} dockIndex={0}/>
    </IonPage>
  );
};

export default Credits;
