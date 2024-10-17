import { IonButtons, IonMenuButton, IonTitle, IonToolbar, IonBackButton, IonIcon, IonImg } from '@ionic/react';
import './InnerMenu.css';

interface ContainerProps {
  name: string;
}
const InnerMenu: React.FC<ContainerProps> = ({ name }) => {

  return (
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonImg class="toolbarImages ion-margin ion-margin-start" slot="start" alt="Logo portolano del Po" src="assets/images/PortolanoPo-28.png" />
        <IonButtons slot="end">
          <IonMenuButton  class="ion-margin-end">
            <IonIcon src="./assets/images/portolanoPo-menu.svg"></IonIcon>
          </ IonMenuButton>
        </IonButtons>
      </IonToolbar>
  );
};

export default InnerMenu;
