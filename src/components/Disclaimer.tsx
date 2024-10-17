import { IonContent, IonItem, IonLabel, IonCheckbox, IonText } from '@ionic/react';
import './Disclaimer.css';

interface ContainerProps {
  setDisclaimerChecked: (b:boolean)=>void;
}

const Disclaimer: React.FC<ContainerProps> = ({ setDisclaimerChecked }) => {

  function innerSetDisclaimerChecked()
  {
    setDisclaimerChecked(true);
  }

  return (
      <IonContent>
        <IonItem>
          <IonText className="ion-margin-top">
            <h2 className="ion-text-center">DISCLAIMER SULL&rsquo;USO DELL&rsquo;APP</h2>

            <div className="ion-text-justify ">
              <p>INFORMAZIONI AGLI UTILIZZATORI</p>
              <p>La navigazione sul fiume &egrave; un&rsquo;attivit&agrave; che pu&ograve; comportare rischi e prima di effettuarla occorre avere le conoscenze e le competenze per farlo.</p>
              <p>I dati presentati su questa APP NON POSSONO GARANTIRE la percorribilit&agrave; delle tracce di navigazione senza rischi, al <strong>comandante dell&rsquo;imbarcazione</strong>, in modo esclusivo, spetta la direzione della manovra e della navigazione. Il comandante rappresenta nei confronti di tutti gli interessati nell&rsquo;imbarcazione e nel carico I poteri che gli sono attribuiti dalla legge.</p>
              <p>Quindi chi si appresta a svolgere attivit&agrave; di navigazione sul fiume, in base alla propria esperienza, alle condizioni metereologiche (anche dei giorni precedenti) deve valutare le informazioni fornite dall&rsquo;app.</p>
              <p>In ogni caso gli enti realizzatori dell&rsquo;app non forniscono garanzie di&nbsp; sicurezza degli attracchi e dei percorsi descritti, e non si assumono nessuna responsabilit&agrave; per eventuali danno o infortuni derivanti dall&rsquo;uso dell&rsquo;app.</p>
              <p>&nbsp;</p>
              <p>Gli Enti realizzatori dell&rsquo;APP declinano&nbsp; ogni responsabilit&agrave; derivante dall&rsquo;utilizzo delle informazioni fornite dall&rsquo;APP stessa. <strong>Le idrovie di navigazione segnalate</strong>, non possono avere il crisma della assoluta veridicit&agrave; e correttezza in quanto a causa delle condizioni metereologici o del verificarsi di eventi possono cambiare repentinamente.</p>
              <p>&nbsp;</p>
              <p>I link esterni che vengono aperti dalle pagine di questa App non sono sotto il controllo degli autori dell'App, quindi l&rsquo;autore gli Enti realizzatori dell&rsquo;APP declinano ogni responsabilit&agrave; per possibili malware o inaffidabilit&agrave; di tali domini.</p>
              <p>I percorsi, gli attracchi, gli idrometri e le tracce GPX presenti o segnalati &nbsp;nel sito e nell&rsquo;app, come gi&agrave; premesso, nel corso del tempo possono non essere pi&ugrave; funzionali, la natura &egrave; mutevole, quindi bisogna sempre informarsi presso le autorit&agrave; locali circa lo stato dei percorsi e la loro fruibilit&agrave; in totale sicurezza nonch&eacute; rispettare tutte le norme previste dai codici di navigazione&nbsp; e dalle autorit&agrave; competenti.</p>
              <p>&nbsp;</p>
              <p>Non potranno essere ritenuti responsabili gli Enti realizzatori dell&rsquo;APP per qualsiasi danno derivante dall&rsquo;uso dell&rsquo;app stessa che &egrave; finalizzata &nbsp;al rilevamento statistico dei transiti sul fiume Po ai fini di intraprendere miglioramenti utili alla sua navigazione.</p>
              <p>&nbsp;</p>
              <p>Gli Enti realizzatori dell&rsquo;APP non sono responsabili per quanto pubblicato dai dei tracciati. Verranno cancellati i commenti ritenuti offensivi o lesivi dell&rsquo;immagine o della onorabilit&agrave; di terzi, di genere spam, razzisti o che contengano dati personali non conformi al rispetto delle norme sulla Privacy</p>
              <p>&nbsp;</p>
              <p>Questo sito utilizza solo cookie tecnici e i cookie analitici sono resi tecnici perch&eacute; anonimizzati mentre i cookie di profilazione sono esclusivamente di terze parti e il lettore pu&ograve; informarsi su come navigare senza che li siano inviati nel browser nella pagina della Privacy Policy e GDPR. In nessun caso in questo sito saranno richiesti pagamenti ai lettori o richieste di digitare numeri di carte di credito o comunque dati riservati.</p>
            </div>
          </IonText>
        </IonItem>
        <IonItem className="ion-margin-bottom ion-margin-horizontal" lines="none">
           <IonLabel><b>Presa Visione</b></IonLabel>
           <IonCheckbox color="success"  onIonChange={e => innerSetDisclaimerChecked()} />
         </IonItem>
      </IonContent>
  );
};

export default Disclaimer;
