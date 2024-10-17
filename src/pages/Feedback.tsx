import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonItem, IonLabel, IonInput, IonButton, IonCheckbox, IonText, IonTextarea, IonAlert } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ListItems from '../components/ListItems';
import InnerMenu from '../components/InnerMenu';
import GpsSinglePointComponent from '../components/GpsSinglePointComponent';
import { useForm } from "react-hook-form";
import { Device } from '@capacitor/device';
import PageEventHandler from "../components/PageEventHandler"
import './Feedback.css';

const Feedback: React.FC = () => {

  const pageName = "Invio segnalazioni";
  const [userCoords, setUserCoords] = useState<any|null>(null)
  const [showAlert, setShowAlert] = useState(false);
  const [alertTit, setAlertTit] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [deviceId, setDeviceId] = useState("-");
  const { register, formState: { errors }, handleSubmit, reset } = useForm();
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);

  // retrieve the device UUID
  const getDeviceInfo = async () => {
    const devId = await Device.getId();
    setDeviceId(devId.uuid);
  };

  // call function to retrieve the device UUID
  useEffect(() => {
   getDeviceInfo();
 }, []);

  // send post req to save data
  const sendFeedback = (data:any) => {
    const postData = {
      name: data.name,
      email: data.email,
      message: data.message,
      userAgent: window.navigator.userAgent,
      lat: (userCoords != null ? userCoords.latitude : 0),
      lng: (userCoords != null ? userCoords.longitude : 0),
      uuid: deviceId,
      h: "gkzLoFk0MN58TGqCJj",
      act: 3
    }

    const url = "https://www.portolanodelpo.it/poServer/poServer.php";
    fetch(url, {
        method: 'post',
        mode: 'cors', // this has to be 'cors'
        body: JSON.stringify(postData),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }})
      .then(res => res.json())
      .then(
        (response) => {
          setAlertTit("Grazie!")
          setAlertMessage("Segnalazione inviata correttamente - Grazie per aiutarci a migliorare il servizio ai naviganti del Po.");
          setShowAlert(true);
          reset();
        },
        (error) => {
          console.log('Problema sul server: ', error);
          setAlertTit('Errore sul server')
          setAlertMessage("C'è stato un problema sul server! Per favore riavvia l'app e riprova.");
          setShowAlert(true);
        })
      .catch(error => {
        console.log('Problema nell\'invio del messaggio: ', error);
        setAlertTit('Errore di invio')
        setAlertMessage("C'è stato un problema nell'invio del messaggio! Per favore riavvia l'app e riprova.");
        setShowAlert(true);
      });
  }

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
          Se avete avvistato dei pericoli non segnalati o delle situazioni anomale sul fiume o sulle sue sponde segnalatecelo, ci attiveremo quanto prima
          per verificare la situazione e intervenire dove necessario.
        </div>
        <form className="ion-padding" onSubmit={handleSubmit(sendFeedback)}>
          <IonItem>
            <IonLabel position="floating">Nome</IonLabel>
            <IonInput {...register("name", { required: true, maxLength: 20 })} />
            {errors.name?.type === 'required' &&
            <IonText color="danger" className="ion-padding-start">
              <small>Immettere il suo nome</small>
            </IonText>
            }
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput {...register("email", { required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i, minLength: 8 })} type="email" />
            {errors.email?.type === 'required' &&
              <IonText color="danger" className="ion-padding-start">
                <small>Immettere un indirizzo mail</small>
              </IonText>
            }
            {errors.email?.type === 'pattern' &&
              <IonText color="danger" className="ion-padding-start">
                <small>Formato email non valido</small>
              </IonText>
            }
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Messaggio</IonLabel>
            <IonTextarea rows={6} cols={20} {...register("message", { required: true })}></IonTextarea>
          </IonItem>
          {errors.message?.type === 'required' &&
            <IonText color="danger" className="ion-padding-start">
              <small>Immettere il testo del messaggio da inviare</small>
            </IonText>
          }
          <IonItem>
            <IonLabel>Accetto la  <a href={`/rulebook`}>Privacy Policy</a>  dell'app*</IonLabel>
            <IonCheckbox color="success" slot="start" onIonChange={(e) => e.detail.checked ? setSubmitBtnDisabled(false) : setSubmitBtnDisabled(true)}/>
          </IonItem>
          <IonButton className="ion-margin-top feedSubBtn" type="submit" expand="block" disabled={submitBtnDisabled} id="submitBtn">
            Invia segnalazione
          </IonButton>
        </form>
      </IonContent>
      <IonAlert
        header={alertTit}
        isOpen={showAlert} message={alertMessage} buttons={[{ text: 'Ok' }]} onDidDismiss={() => setShowAlert(false)} />
      <GpsSinglePointComponent setUserCoords={setUserCoords}/> {/* pass the setter function to the child so we maintain the state watcher */}
      <PageEventHandler pageIndex={11} dockIndex={0}/>
    </IonPage>
  );
};

export default Feedback;
