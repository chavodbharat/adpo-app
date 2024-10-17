import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton ,IonIcon, IonItem, IonText, IonAlert, IonImg } from '@ionic/react';
import { useParams } from 'react-router-dom';
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import React, { useState, useEffect } from 'react';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem'; // currently not used
import { Browser } from '@capacitor/browser';
import PageEventHandler from "../components/PageEventHandler";
import { Device } from '@capacitor/device';
import { Clipboard } from '@capacitor/clipboard';
import './Rulebook.css';

import {shapeVertices} from "../js/asta_po.js";

let deviceId = "-";

const Rulebook: React.FC = () => {

  const pageName = "Normative sulla navigazione";
  const [showAlert, setShowAlert] = useState(false);

  // retrieve the device UUID
  const getDeviceInfo = async () => {
    const devId = await Device.getId()
      .then((devId) => deviceId = devId.uuid );
  };


  useEffect(() => {
    getDeviceInfo();      // retrieve unique device ID for the whole app
   }, []); // empty dependency array to call userEffect() only once, onload.

   function relevantPoint(testPoint: number[])
   {
      let result = false;
      let j = shapeVertices.length - 1;
      console.log("testPoint : ",testPoint);
      if (testPoint.length > 1)
      {
        console.log("testPoint ok - let's begin. Vertices in for loop: ",shapeVertices.length);
        for (let i = 0; i < shapeVertices.length; i++)
        {
          if (shapeVertices[i][1] < testPoint[1] && shapeVertices[j][1] >= testPoint[1] || shapeVertices[j][1] < testPoint[1] && shapeVertices[i][1] >= testPoint[1])
          {
              if (shapeVertices[i][0] + (testPoint[1] - shapeVertices[i][1]) / (shapeVertices[j][1] - shapeVertices[i][1]) * (shapeVertices[j][0] - shapeVertices[i][0]) < testPoint[0])
              {
                  result = !result;
                  console.log("Changing value: ", result);
              }
          }
          j = i;
        }
      }
      
      console.log("Finished: ", result);
      
      return result;
   }

  //  relevantPoint([9.237448, 45.145173]) // ok vicino pavia - false - secondo: ok
  //  relevantPoint([9.116203 , 45.190669]) // ok vicino pavia - true - secondo: ok
  //  relevantPoint([9.541577 , 45.134875]) // ok vicino pavia - true - secondo: ok
  //  relevantPoint([9.299468, 45.134865]) // ok vicino pavia [false] - sbaglia - secondo sbaglia
  //  relevantPoint([9.314907, 45.154738]) // ok vicino pavia - false - secondo: ok
  //  relevantPoint([ 10.372799, 44.836934]) // ok vicino parma - false
  //  relevantPoint([ 10.434876,44.937495]); // ok vicino parma - sbaglia
  // relevantPoint([ 10.427796, 44.950165]); // vicino pr true - sbaglia - secondo: sbaglia
  // relevantPoint([ 10.362872, 44.971174 ]); // vicino pr - false -sbaglia - secondo: ok
  // relevantPoint([ 10.547338, 44.911295]); // boretto true - ok
  // relevantPoint([ 11.977950, 44.985775]); // ok vicino ferrara - true
  // relevantPoint([ 11.982730,44.967452]); // ok vicino ferrara - false
  // relevantPoint([ 12.622881,44.968972]); // ok in mare - false
  // relevantPoint([ 12.252193, 45.127560]); // chioggia true
  // relevantPoint([ 12.286535, 44.916302]); //foce true
  
/*
function verifyIfExists(ITEM:any, LIST:any)
{
  let verification = false;
  for (let i = 0; i < LIST.length; i++)
  {
    if (LIST[i] === ITEM)
    {
      verification = true;
      break;
    }
  }
  return verification;
}

async function readdir(url:string, dir: Directory) {
  try {
    // let ret = await Filesystem.readdir({
    //   path: url,
    //   directory: dir
    // }).then(res => {
    //   console.log(`Dir content : length: ${res.files.length} - 0: ${res.files[0]}`);
    //
    //   res.files.map((name, index) => {
    //     console.log(`Dir content : ${index} + ${name}`);
    //     readdir('/rList', dir)
    //   });
    // }).catch(err => {
    //   console.log(`Ex while reading folder :`,err);
    // })


    console.log('After searching dirs...');
//    await Filesystem.readFile({path: './public/assets/docs/regolamento_segnaletica.pdf'}).then(f => {

    await Filesystem.getUri({path: '/', directory: dir}).then(u => {
      console.log("File length: ",u.uri);
    }).catch(err => {
      console.log(`Ex while reading file :`,err);
    })

  }
  catch(e) {
    console.log('Unable to read dir: ' + e);
  }
}

const storeAndOpen = async () => {
  await Filesystem.readFile(
  {
    path: 'https://www.agenziapo.it/sites/default/files/dwd/attivita/navigazione_interna/segnaletica/regolamento_segnaletica.pdf'
  }).then(f => {
    Filesystem.writeFile(
    {
        path: '/',
        directory: FilesystemDirectory.Documents,
        data: f.data
    }).then(wf => {
      console.log("File written in: ",wf.uri);
      console.log("Trying to browse it ");

      Browser.open({ url: wf.uri});

    }).catch(err => {
      console.log(`Ex while reading file :`,err);
    })


  }).catch(err => {
    console.log(`Ex while reading file :`,err);
  })
}

 const open0 = () => {readdir('/', FilesystemDirectory.Documents)}
 const open1 = () => {readdir('/', FilesystemDirectory.Data)}
 const open2 = () => {readdir('/', FilesystemDirectory.Library)}
*/
  return (
    <IonPage>
      <IonHeader>
        <InnerMenu name={pageName} />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <h1 className="mainTit" slot="start">{pageName}</h1>
        </IonItem>
        <div className="ion-padding">
          <h4>Norme di <b>Generali</b>:</h4>
          <div className="ion-text-justify ">
            <ul>
              <li>R.D. 30 marzo 1942, n. 327 Codice delle Navigazione</li>
              <li>D.P.R. 28 giugno 1949, n.63 - Regolamento  per la Navigazione Interna</li>
              <li>Decreto legislativo 29 luglio 2015, n. 129 "Disciplina sanzionatoria delle violazioni delle disposizioni del Regolamento (UE) n. 1177/2010, che modifica il Regolamento (CE) n. 2006/2004, relativo ai diritti dei passeggeri che viaggiano via mare e per vie navigabili interne"</li>
              <li>Direttiva Europea 2017/2397 DEL PARLAMENTO EUROPEO E DEL CONSIGLIO del 12 dicembre 2017 relativa al riconoscimento delle qualifiche professionali nel settore della navigazione interna e che abroga le direttive 91/672/CEE e 96/50/CE del Consiglio</li>
            </ul>
          </div>
          <br />
          <h4>Imbarcazioni <b>Diportistiche</b>:</h4>
          <div className="ion-text-justify ">
            <ul>
              <li>DECRETO 21 gennaio 1994, n. 232 - Regolamento di sicurezza per la navigazione da diporto</li>
              <li>LEGGE 8 luglio 2003, n. 172 Disposizioni per il riordino e il rilancio della nautica da diporto e del turismo nautico</li>
              <li>DECRETO 30 aprile 2003, n. 175 Regolamento recante disposizioni per il rilascio dell'autorizzazione agli organismi di certificazione in materia di progettazione, di costruzione e immissione in commercio di unit&agrave; da diporto e loro componenti</li>
              <li>DECRETO Legislativo 18 luglio 2005, n. 171 Codice della nautica da diporto ed attuazione della direttiva 2003/44/CE, a norma dell'articolo 6 della legge 8 luglio 2003, n. 172</li>
              <li>DECRETO 29 luglio 2008, n. 146 Regolamento di attuazione dell'articolo 65 del decreto legislativo 18 luglio 2005, n. 171, recante il codice della nautica da diporto</li>
              <li>DIRETTIVA 2013/53/UE DEL PARLAMENTO EUROPEO E DEL CONSIGLIO del 20 novembre 2013 relativa alle imbarcazioni da diporto e alle moto d'acqua e che abroga la direttiva 94/25/CE</li>
              <li>Rettifica della direttiva 2013/53/UE del Parlamento europeo e del Consiglio, del 20 novembre 2013, relativa alle imbarcazioni da diporto e alle moto d'acqua e che abroga la direttiva 94/25/CE</li>
              <li>LEGGE 7 ottobre 2015, n. 167 Delega al Governo per la riforma del codice della nautica da diporto</li>
              <li>DECRETO LEGISLATIVO 11 gennaio 2016, n. 5 Attuazione della direttiva 2013/53/UE del Parlamento europeo e del Consiglio, del 20 novembre 2013, relativa alle unit&agrave; da diporto e alle moto d'acqua e che abroga la direttiva 94/25/CE (16G00001)</li>
            </ul>
          </div>
          <br />
          <br />
          <h4>Note legali</h4>
          <div className="ion-text-justify ">
            <p><strong>App “Portolano del Po” – guida di navigazione per appassionati diportisti alla scoperta del fiume più lungo d’Italia, dei suoi paesaggi, dei suoi sapori e della sua cultura locale, attraversando le Riserve della Biosfera dal Ticino al Po Grande fino al Delta Po.</strong></p>
            <p>&nbsp;</p>
            <p>L’ Autorità di Bacino Distrettuale del fiume Po e l’Agenzia Interregionale per il fiume Po hanno realizzato questo sito per promuovere il progetto Portolano del Po</p>
            <p>&nbsp;</p>
            <h5>Copyright</h5>
            <p>Gli oggetti presenti in questo sito per lo scaricamento (download)&nbsp; sono liberamente e gratuitamente disponibili fatta eccezione per la documentazione fotografica non realizzata direttamente dall’Ente, gli autori ove indicati o la fonte stessa devono in tutti i casi essere citati nelle pubblicazioni in qualunque forma realizzate e diffuse.<br />
            I contenuti del sito – a titolo esemplificativo e non esaustivo, codice di script, grafica, testi, tabelle, immagini, suoni e ogni altra opera od informazione disponibile in qualunque forma – sono protetti ai sensi della normativa sul diritto d’autore.<br />
            Tutte le aziende e i prodotti menzionati in questo sito sono identificati dai rispettivi marchi che sono o possono essere protetti da brevetti e/o copyright.</p>
            <p>Per fini di lucro è consentito utilizzare, copiare e distribuire i documenti e le relative immagini disponibili su questo sito solo dietro permesso scritto (o egualmente valido a fini legali) di Autorità di Bacino Distrettuale del fiume Po, fatte salve eventuali spettanze di diritto.</p>
            <p>&nbsp;</p>
            <h5>Responsabilità derivanti dall’utilizzo del sito</h5>
            <p>L’ Autorità di Bacino Distrettuale del fiume Po e l’Agenzia Interregionale per il fiume Po si impegnano costantemente per assicurare la qualità delle informazioni pubblicate sul sito , nonché la loro integrità, aggiornamento, completezza, tempestività, semplicità di consultazione e accessibilità. In ogni caso l’utente accetta che il sito e tutti i suoi contenuti, ivi compresi i servizi eventualmente offerti, sono forniti “così come sono”. L’ Autorità di Bacino Distrettuale del fiume Po e l’Agenzia Interregionale per il fiume Po, pertanto, non rilasciano alcun tipo di garanzia, esplicita o implicita, riguardo tali contenuti, ivi compresi, senza alcuna limitazione, la liceità, il diritto di proprietà, la convenienza o l’adeguatezza a particolari scopi o usi.</p>
            <p>In nessun caso L’ Autorità di Bacino Distrettuale del fiume Po e l’Agenzia Interregionale per il fiume Po potranno essere ritenuti responsabili dei danni di qualsiasi natura causati direttamente o indirettamente dall’accesso al sito, dall’incapacità o impossibilità di accedervi o dall’uso delle informazioni contenute. In nessuna circostanza L’ Autorità di Bacino Distrettuale del fiume Po e l’Agenzia Interregionale per il fiume Po, i suoi fornitori o i collaboratori, potranno essere ritenuti responsabili per qualsiasi danno diretto, indiretto, incidentale, consequenziale, legato all’uso del presente sito web o di altri siti web ad esso collegati da un link ipertestuale, ivi compresi senza alcuna limitazione, i danni quali la perdita di profitti o fatturato, l’interruzione di attività aziendale o professionale, la perdita di programmi o altro tipo di dati ubicati sul sistema informatico dell’utente o altro sistema.</p>
            <p>&nbsp;</p>
            <h5>Responsabilità siti esterni collegati</h5>
            <p>L’ Autorità di Bacino Distrettuale del fiume Po e l’Agenzia Interregionale per il fiume Po non assumono alcuna responsabilità in merito ad eventuali problemi che possano insorgere per effetto dell’utilizzazione dei siti esterni collegati al proprio sito.</p>
            <p>I collegamenti a siti esterni, indicati nel sito, sono forniti come semplice servizio agli utenti, con esclusione di ogni responsabilità sulla correttezza e sulla completezza dell’insieme dei collegamenti indicati.</p>
            <p>L’indicazione dei collegamenti non implica da parte dell’ Autorità di Bacino Distrettuale del fiume Po e dell’Agenzia Interregionale per il fiume Po alcun tipo di approvazione o condivisione di responsabilità in relazione alla legittimità, alla completezza e alla correttezza delle informazioni contenute nei siti indicati.</p>
            <p>&nbsp;</p>
            <h5>Segnalazione di errori</h5>
            <p>L’obiettivo principale di questo portale è fornire un’informazione tempestiva e precisa.<br />
            Qualora dovessero essere rilevati errori, inesattezze o malfunzionamenti, potranno essere segnalate al seguente indirizzo: <em>segnalazioni@portolanodelpo.it. </em>&nbsp;L’ Autorità di Bacino Distrettuale del fiume Po e l’Agenzia Interregionale per il fiume Po &nbsp;provvederanno a correggerli nel più breve tempo possibile.</p>
            <p>&nbsp;</p>
            <h5>Modalità per i link</h5>
            <p>Eventuali&nbsp; link al sito non devono in alcun caso determinare, neppure nell’utente più inesperto, confusione circa la titolarità sia del sito contenente il link, sia di questo sito, né tra le attività esercitate dal soggetto che effettua il link e quelle dei siti dell’Autorità di Bacino Distrettuale del fiume Po e dell’Agenzia Interregionale per il fiume Po. Sono in ogni caso vietate le pratiche di framing. La realizzazione di un link ai portali dell’Autorità Distrettuale del Fiume Po costituisce integrale accettazione delle presenti regole. L’eventuale inosservanza delle suddette avvertenze sarà perseguita nelle sedi competenti</p>
          </div>
          <br />
          <br />
          <h4>Informativa sulla privacy</h4>
          <div className="ion-text-justify ">
            <p><strong>PRIVACY POLICY</strong></p>
            <p><strong>APP Mobile: AppStore, Google Play</strong></p>
            <p>&nbsp;</p>
            <p>Gentile Utente,</p>
            <p>Noi del progetto “il Portolano del Po” (di seguito “App”) crediamo fermamente nel rispetto dalla tua privacy. Desideriamo applicare la massima trasparenza sulle modalità di utilizzo dei tuoi dati. Nella presente Informativa sulla privacy (“Informativa”), descriviamo le informazioni che raccogliamo, come le usiamo e quando e con chi le condividiamo. Questa Politica si applica all’App e al sito web. Non si applica alle informazioni raccolte o ottenute da o tramite qualsiasi altro mezzo (incluse, senza limitazione, le informazioni raccolte offline, di persona, per telefono e/o per posta o da terze parti al di fuori della App).</p>
            <p><strong>DEFINIZIONI</strong></p>
            <p>In relazione all’utilizzo dell’App si distinguono le seguenti categorie di utilizzatori:</p>
            <p><strong>Utenti</strong>: qualsiasi persona fisica che effettua download della App dai principali app store; utilizza i servizi e le funzioni in essa presenti, ovvero naviga sul sito web di “Portolano sul Po”;</p>
            <p><strong>Amministratori</strong>: personale incaricato da Aipo e ADBPO che dispone dei dati di navigazione acquisiti a seguito di attivazione delle coordinate GPS (su base volontaria) degli utenti per migliorare il servizio, attraverso un monitoraggio del traffico, segnalazioni di anomalie e pericoli sui tragitti o attraverso l’implementazione di ulteriori funzioni che rendono migliore l’esperienza di utilizzo della app.</p>
            <p><strong>Geolocalizzazione: </strong>identificazione della posizione geografica nel mondo reale di un dato oggetto, come ad esempio un telefono cellulare o un computer connesso o meno ad Internet, secondo diverse tecniche.</p>
            <ol>
            <li><strong>TITOLARE DEL TRATTAMENTO e RESPONSABILE PROTEZIONE DATI PERSONALI</strong></li>
            </ol>
            <p>I Contitolari del trattamento ai sensi dell’art. 26 del Regolamento UE sono AIPO e l’ADBPO nelle persone dei propri legali rappresentanti <em>pro tempore</em> (<em>vedi</em> accordo di contitolarità). Il Responsabile della Protezione dei dati ai sensi dell’art. 37 del Regolamento UE n. 679/16 è stato nominato da entrambe le parti, AiPo e ADBPO, ed i relativi dati sono disponibili sul sito web di entrambi gli Enti. L’utente può rivolgersi al Responsabile della Protezione dei Dati all’indirizzo istituzionale dell’Ente.</p>
            <ol start={2}>
            <li><strong>QUALI DATI RACCOGLIAMO?</strong></li>
            </ol>
            <p>Dati necessari per la <strong>navigazione e interazione con gli Enti promotori all’interno della App da parte dell’utente </strong>sono:</p>
            <ul>
            <li>Nome e Cognome (facoltativo)</li>
            <li>Indirizzo e-mail (facoltativo)</li>
            <li>Cronologia ricerche in APP</li>
            <li>Dispositivo Codice IMEI – ID Dispositivo</li>
            <li>Geolocalizzazione (facoltativo, solo previa autorizzazione della app ad accedere alle coordinate del dispositivo in uso)</li>
            </ul>
            <p>L’Utente ha la possibilità, di sua iniziativa di fornire ulteriori dati personali (es. geolocalizzazione, indirizzo e-mail, ecc.) non obbligatori ai fini dell’utilizzo della App. Tali dati verranno inseriti nella propria scheda utente e costituiranno le informazioni base per migliorare l’esperienza di utilizzo della App.</p>
            <p>Potremmo raccogliere informazioni sulla posizione del tuo dispositivo ogni volta che utilizzi la nostra App in base al tuo consenso alla raccolta di queste informazioni solo ed esclusivamente quando dal tuo dispositivo autorizzi la app ad accedere alle tue coordinate GPS. Per ulteriori informazioni vedere il punto successivo (Punto 3).</p>
            <ol start={3}>
            <li><strong>DATI SULLA TUA POSIZIONE</strong></li>
            </ol>
            <p>Al primo accesso, la App mostra un banner di avviso per la richiesta di consenso all’abilitazione delle coordinate GPS. Se autorizzi la App ad accedere alla tua posizione, potrai migliorare l’esperienza di utilizzo della mappa dinamica visualizzando la tua distanza rispetto ai punti di interesse presenti (ad es. lista attracchi, isole naturalistiche, ponti e conche ecc.). Se neghi l’accesso alle coordinate GPS, la App mostra un banner di errore che segnala l’impossibilità di recuperare la tua posizione. Rimosso il banner, l’App mostra comunque le mappe con i vari punti di interesse, senza obbligare l’utente a condividere la propria posizione.</p>
            <p>Le impostazioni del tuo dispositivo mobile potrebbero anche darti la possibilità di scegliere se consentirci di visualizzare la tua geolocalizzazione su base continua, solo quando usi l’app o mai. Fare riferimento alle impostazioni del dispositivo utilizzato per ulteriori informazioni su come abilitare/disattivare i servizi di localizzazione.</p>
            <p>La condivisione della posizione, se autorizzata, consente alla App di acquisire il codice IMEI del dispositivo, che non verrà in alcun modo reso pubblico o condiviso con gli utenti, ma consentirà ai gestori di raccogliere dati importanti per migliorare l’esperienza di utilizzo della App, sviluppando servizi aggiuntivi come il monitoraggio del traffico, segnalando per esempio le aree più congestionate o altre informazioni utili a tutti gli utenti.</p>
            <p><strong>PER QUALE MOTIVO RACCOGLIAMO I TUOI DATI?</strong></p>
            <p>I dati personali raccolti dalla APP <u>senza il consenso</u> dell’utente:</p>
            <ol>
            <li>I dati personali direttamente forniti dall’utente o acquisiti dal funzionamento della App saranno trattati per le finalità inerenti la prestazione dei servizi disponibili attraverso l’App secondo quanto stabilito dalle Condizioni di Utilizzo. Per “finalità inerenti la prestazione dei servizi disponibili attraverso la App” deve intendersi qualsiasi operazione di trattamento dei dati correlata allo svolgimento di tutte le attività <u>connesse o strumentali</u> all’erogazione dei servizi offerti tramite la App in parola (download, attivazione). La base giuridica del trattamento per le finalità suindicate è l’art. 6, paragrafo 1, lettera b) del GDPR;</li>
            <li>I dati comunicati dall’interessato sono trattati, altresì, per soddisfare gli obblighi previsti dalle norme di legge, di regolamento o dalla normativa europea ovvero da disposizioni impartite da Autorità a ciò legittimate dalla legge e da Organi di Vigilanza e controllo. La base giuridica del trattamento per le finalità suindicate è l’art. 6, paragrafo 1, lettera c) del GDPR;</li>
            <li>Si rappresenta che i sistemi informatici e le procedure software preposte al funzionamento della App (Apple Store o Google Play) acquisiscono, nel corso del loro normale esercizio, alcuni dati comunque riferibili all’utente la cui trasmissione è implicita nell’uso dei protocolli di comunicazione internet, degli smartphone e dei dispositivi utilizzati. L’interessato potrà consultare le informazioni sulla privacy rese disponibili sui seguenti siti: Apple Store: https://www.apple.com/legal/internet-services/itunes/it/terms.html Google Play: https://play.google.com/intl/it_it/about/play-terms.html Eventuali destinatari e le eventuali categorie di destinatari dei dati personali.</li>
            </ol>
            <p>I dati personali raccolti dalla APP trattati con il <u>previo consenso</u> dell’utente ai sensi dell’art. 6, paragrafo 1, lettera a) del GDPR:</p>
            <ol>
            <li>Abilitazione del servizio di geolocalizzazione;</li>
            <li>Nome dell’utente ed e-mail, qualora si intenda utilizzare il form “<em>Invio segnalazioni</em>” all’interno della App. Hai infatti la facoltà di inviarci segnalazioni su pericoli non segnalati o delle situazioni anomale avvistate sul tratto di navigazione percorso.</li>
            </ol>
            <p>&nbsp;</p>
            <ol start={4}>
            <li><strong>CON CHI CONDIVIDIAMO I TUOI DATI</strong></li>
            </ol>
            <p>I dati personali raccolti potranno essere trattati da soggetti o categorie di soggetti che agiscono come incaricati ai sensi dell’art. 29 o, ancora, come responsabili del trattamento dei dati ai sensi dell’art. 28 del GDPR. Entrambi sono considerati “<em>Amministratori”</em> secondo la definizione riportata nel capitolo “Definizioni” della presente informativa.</p>
            <p>AIPO e l’ADBPO non comunicano i dati personali degli utenti a nessun soggetto al di fuori di quelle preventivamente autorizzate (es. incaricati e sviluppatori della App).</p>
            <p>L’APP utilizza servizi di terze parti e in particolare di Open Street Map (<a href="https://wiki.osmfoundation.org/wiki/Terms_of_Use">https://wiki.osmfoundation.org/wiki/Terms_of_Use</a>) per l’elaborazione dei dati sulle mappe dinamiche.</p>
            <p>Si rappresenta che i sistemi informatici e le procedure software preposte al funzionamento della App (sia su Apple Store che su Google Play) acquisiscono, nel corso del loro normale esercizio, alcuni dati comunque riferibili all’utente la cui trasmissione è implicita nell’uso dei protocolli di comunicazione internet, degli smartphone e dei dispositivi utilizzati. L’interessato potrà consultare le informazioni sulla privacy rese disponibili sui seguenti siti: Apple Store: https://www.apple.com/legal/internet-services/itunes/it/terms.html Google Play: https://play.google.com/intl/it_it/about/play-terms.html Eventuali destinatari e le eventuali categorie di destinatari dei dati personali.</p>
            <ol start={5}>
            <li><strong>CON QUALI MODALITA’ TRATTIAMO I TUOI DATI?</strong></li>
            </ol>
            <p>La App tratta i dati personali nel pieno rispetto dei principi di liceità, correttezza e pertinenza così come disciplinati dal Regolamento europeo in materia di protezione dei dati personali (GDPR). Il trattamento è effettuato attraverso procedure di inserimento manuale ovvero attraverso strumenti automatizzati atti a memorizzare, gestire ed elaborare i dati stessi. I dati raccolti ed oggetto di trattamento sono protetti con metodologie fisiche e logiche tali da ridurre al minimo i rischi di accesso non consentito, diffusione, perdita e distruzione dei dati, ai sensi degli art. 24 e 32 del Regolamento.</p>
            <p>Il trattamento dei dati personali dell’utente potrà dunque essere effettuato con l’ausilio di mezzi elettronici o comunque automatizzati e, in specie, per il tramite di database e banche dati di proprietà dello scrivente, con modalità e procedure strettamente necessarie al perseguimento delle finalità sopra descritte. In relazione alle suindicate finalità, il trattamento dei dati personali dell’utente avverrà mediante strumenti manuali, informatici e telematici per la mera realizzazione delle finalità stesse e, comunque, in modo da garantirne la sicurezza e la riservatezza.</p>
            <ol start={6}>
            <li><strong>DOVE CONSERVIAMO I TUOI DATI?</strong></li>
            </ol>
            <p>I tuoi dati personali sono raccolti e conservati al di fuori del territorio nazionale, ma all’interno dell’Unione Europea, solo ed esclusivamente per l’esecuzione dei servizi richiesti tramite la nostra App e nel rispetto delle specifiche disposizioni previste dal Regolamento. Per maggiori dettagli sul servizio di Hosting e infrastruttura back-end scelto per la nostra App ti invitiamo a consultare la seguente pagina di Serverplan.com: <a href="https://www.serverplan.com/about-us/privacy">https://www.serverplan.com/about-us/privacy</a></p>
            <ol start={7}>
            <li><strong>PER QUANTO TEMPO CONSERVIAMO I TUOI DATI</strong></li>
            </ol>
            <p>Conserviamo le informazioni che raccogliamo per tutto il tempo necessario a consentire il perseguimento degli scopi per cui le abbiamo originariamente raccolte:</p>
            <ol>
            <li>Affinché tu possa usare la nostra App;</li>
            <li>Ricostruzione della cronologia delle rotte più frequentate e degli attracchi più frequentati;</li>
            <li>Per individuare e prevenire abusi della nostra App, attività illegali e violazioni dei nostri Termini e Condizioni d’Uso della App;</li>
            <li>Per garantire la conformità ai requisiti legali, fiscali e contabili applicabili.</li>
            </ol>
            <p>Quando non abbiamo alcuna legittima esigenza in corso per conservare le tue informazioni, le cancelleremo o adotteremo misure per anonimizzarle o eliminarle completamente, senza possibilità di recupero.</p>
            <ol start={8}>
            <li><strong>SICUREZZA</strong></li>
            </ol>
            <p>Impieghiamo misure tecniche e organizzative progettate per proteggere le tue informazioni che sono sotto il nostro controllo e che elaboriamo per tuo conto da accesso, raccolta, utilizzo, divulgazione, copia, modifica o eliminazione non autorizzati, sia durante la trasmissione che una volta ricevuti. Ad esempio, memorizziamo tutte le informazioni che ci fornisci su server su cui vengono utilizzati i controlli di sicurezza. Utilizziamo firewall progettati per proteggere dagli intrusi e testare le vulnerabilità della rete. Tuttavia, nessun metodo di trasmissione su Internet o metodo di archiviazione elettronica è completamente sicuro.</p>
            <ol start={9}>
            <li><strong>I TUOI DIRITTI</strong></li>
            </ol>
            <p>Rispondiamo a tutte le richieste che riceviamo da persone che desiderano esercitare i propri diritti di protezione dei dati in conformità con le leggi sulla protezione dei dati applicabili. Puoi contattarci con la tua richiesta inviando un’e-mail a <em>segnalazioni@portolanodelpo.it.</em> Di seguito sono annoverati i tuoi diritti:</p>
            <ul>
            <li>Accedere ai tuoi dati, correggerli, aggiornarli o cancellarli. Gli amministratori possono procedere in qualsiasi momento alla cancellazione dei dati raccolti;</li>
            <li>Richiedere informazioni sull’origine, finalità e modalità di trattamento, periodo di conservazione e eventuali destinatari o categorie di destinatari dei dati personali;</li>
            <li>Obiettare al trattamento dei tuoi dati, chiederci di limitare il trattamento dei tuoi dati, o richiedere la portabilità dei tuoi dati;</li>
            <li>Revocare il consenso in qualsiasi momento nel caso abbiamo raccolto e trattato i tuoi dati. La revoca del consenso non arrecherà pregiudizio alla legalità del trattamento che abbiamo effettuato prima della stessa, e non influenzerà il trattamento dei tuoi dati effettuato secondo basi legali per il trattamento diverse dal consenso.</li>
            <li>Sporgere reclamo a un’autorità per la protezione dei dati competente rispetto alla raccolta dei tuoi dati da parte nostra. Per maggiori informazioni, ti invitiamo a contattare l’autorità locale competente per la protezione dei dati. I recapiti delle autorità per la protezione dei dati all’interno dell’Unione Europa sono disponibili qui.</li>
            </ul>
            <p>&nbsp;</p>
            <ol start={10}>
            <li><strong>MODIFICHE</strong></li>
            </ol>
            <p>La presente informativa potrebbe essere soggetta a modifiche. Affinché gli utenti siano sempre aggiornati, ti invitiamo a visitare periodicamente questa pagina. Inoltre, qualora tali modifiche abbiano un impatto sui dati relativi agli utenti (ad esempio quando intendiamo trattare i dati personali per finalità diverse da quelle precedentemente comunicate nella presente Informativa), sarà nostra cura informarti prima che tali modifiche abbiano effetto, pubblicandole con la massima evidenza sulla nostra App e sul nostro sito web.</p>
            <p>&nbsp;</p>
            <p>Parma (PR), 01/06/2022</p>
          </div>
          <br />
          <br />
          <h4>Disclaimer sull&rsquo;uso dell&rsquo;App</h4>
          <div className="ion-text-justify ">
            <p>INFORMAZIONI AGLI UTILIZZATORI</p>
            <p>La navigazione sul fiume &egrave; un&rsquo;attivit&agrave; che pu&ograve; comportare rischi e prima di effettuarla occorre avere le conoscenze e le competenze per farlo.</p>
            <p>I dati presentati su questa APP NON POSSONO GARANTIRE la percorribilit&agrave; delle tracce di navigazione senza rischi, al <strong>comandante dell&rsquo;imbarcazione</strong>, in modo esclusivo, spetta la direzione della manovra e della navigazione. Il comandante rappresenta nei confronti di tutti gli interessati nell&rsquo;imbarcazione e nel carico I poteri che gli sono attribuiti dalla legge.</p>
            <p>Quindi chi si appresta a svolgere attivit&agrave; di navigazione sul fiume, in base alla propria esperienza, alle condizioni metereologiche (anche dei giorni precedenti) deve valutare le informazioni fornite dall&rsquo;app.</p>
            <p>In ogni caso gli enti realizzatori dell&rsquo;app non forniscono garanzie di&nbsp; sicurezza degli attracchi e dei percorsi descritti, e non si assumono nessuna responsabilit&agrave; per eventuali danno o infortuni derivanti dall&rsquo;uso dell&rsquo;app.</p>
            <p>Gli Enti realizzatori dell&rsquo;APP declinano&nbsp; ogni responsabilit&agrave; derivante dall&rsquo;utilizzo delle informazioni fornite dall&rsquo;APP stessa. <strong>Le idrovie di navigazione segnalate</strong>, non possono avere il crisma della assoluta veridicit&agrave; e correttezza in quanto a causa delle condizioni metereologici o del verificarsi di eventi possono cambiare repentinamente.</p>
            <p>I link esterni che vengono aperti dalle pagine di questa App non sono sotto il controllo degli autori dell'App, quindi l&rsquo;autore gli Enti realizzatori dell&rsquo;APP declinano ogni responsabilit&agrave; per possibili malware o inaffidabilit&agrave; di tali domini.</p>
            <p>I percorsi, gli attracchi, gli idrometri e le tracce GPX presenti o segnalati &nbsp;nel sito e nell&rsquo;app, come gi&agrave; premesso, nel corso del tempo possono non essere pi&ugrave; funzionali, la natura &egrave; mutevole, quindi bisogna sempre informarsi presso le autorit&agrave; locali circa lo stato dei percorsi e la loro fruibilit&agrave; in totale sicurezza nonch&eacute; rispettare tutte le norme previste dai codici di navigazione&nbsp; e dalle autorit&agrave; competenti.</p>
            <p>Non potranno essere ritenuti responsabili gli Enti realizzatori dell&rsquo;APP per qualsiasi danno derivante dall&rsquo;uso dell&rsquo;app stessa che &egrave; finalizzata &nbsp;al rilevamento statistico dei transiti sul fiume Po ai fini di intraprendere miglioramenti utili alla sua navigazione.</p>
            <p>Gli Enti realizzatori dell&rsquo;APP non sono responsabili per quanto pubblicato dai dei tracciati. Verranno cancellati i commenti ritenuti offensivi o lesivi dell&rsquo;immagine o della onorabilit&agrave; di terzi, di genere spam, razzisti o che contengano dati personali non conformi al rispetto delle norme sulla Privacy</p>
            <p>Questo sito utilizza solo cookie tecnici e i cookie analitici sono resi tecnici perch&eacute; anonimizzati mentre i cookie di profilazione sono esclusivamente di terze parti e il lettore pu&ograve; informarsi su come navigare senza che li siano inviati nel browser nella pagina della Privacy Policy e GDPR. In nessun caso in questo sito saranno richiesti pagamenti ai lettori o richieste di digitare numeri di carte di credito o comunque dati riservati.</p>
          </div>
          <br />
        </div>
        <IonItem button={true} onClick={()=>{setShowAlert(true)}} class="text-center">
          <IonImg class="toolbarImages" alt="Logo portolano del Po" slot="end" src="assets/images/PortolanoPo-28.png" />
        </IonItem>
          <IonAlert header={'Codice univoco dispositivo'} isOpen={showAlert} message={deviceId}
          buttons={[{ text: 'Copia', handler: () => { Clipboard.write({string: deviceId}); } }]} onDidDismiss={() => setShowAlert(false)} />
      </IonContent>
      <PageEventHandler pageIndex={10} dockIndex={0}/>
    </IonPage>
  );
};

export default Rulebook;



/*

Filesystem capacitor plugins
Android permissions:
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

*/
