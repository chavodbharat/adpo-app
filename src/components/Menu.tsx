import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { homeOutline, homeSharp, appsOutline, appsSharp, bookmarkOutline, bookOutline, bookSharp, constructOutline, constructSharp, boatOutline, boatSharp, mapOutline, mapSharp, analyticsOutline, analyticsSharp, warningOutline, warningSharp, paperPlaneOutline, paperPlaneSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  title: string;
  indexTitle: string;
  indexSubTitle: string;
  icon: string;
}

const appPages: AppPage[] = [
  {
    title: 'Benvenuti',
    url: '/home',
    icon: "./assets/images/portolanoPo-icon-1.svg",
    indexTitle: '',
    indexSubTitle: ''
  },
  {
    title: 'Attracchi e Idrovia',
    indexTitle: 'Attracchi sul Po',
    indexSubTitle: '& Idrovia Navigabile',
    url: '/docksMap',
    icon: "./assets/images/portolanoPo-icon-5.svg"
  },
  {
    title: 'Lista attracchi',
    indexTitle: 'Lista Attracchi',
    indexSubTitle: 'sul Po',
    url: '/docks',
    icon: "./assets/images/portolanoPo-icon-2.svg"
  },
  {
    title: 'Mappe di navigazione',
    indexTitle: 'Mappe di',
    indexSubTitle: 'Navigazione',
    url: '/maps',
    icon: "./assets/images/portolanoPo-icon-3.svg"
  },
  {
    title: 'Isole Naturalistiche',
    indexTitle: 'Isole',
    indexSubTitle: 'Naturalistiche',
    url: '/islands',
    icon: "./assets/images/portolanoPo-icon-4.svg"
  },
  {
    title: 'Bollettino e Avvisi',
    indexTitle: 'Bollettini',
    indexSubTitle: 'e Avvisi',
    url: '/batimetric',
    icon: "./assets/images/portolanoPo-icon-11b.svg"
  },
  {
    title: 'Segnaletica e Regolamento',
    indexTitle: 'Segnaletica e ',
    indexSubTitle: 'Regolamento',
    url: '/signs',
    icon: "./assets/images/portolanoPo-icon-6.svg"
  },
  {
    title: 'Ponti e Conche',
    indexTitle: 'Ponti',
    indexSubTitle: 'e Conche',
    url: '/bridges',
    icon: "./assets/images/portolanoPo-icon-12.svg"
  },
  {
    title: 'Norme sulla Navigazione',
    indexTitle: 'Normative di',
    indexSubTitle: 'Navigazione',
    url: '/rulebook',
    icon: "./assets/images/portolanoPo-icon-10.svg"
  },
  {
    title: 'Invio segnalazioni',
    indexTitle: 'Invio',
    indexSubTitle: 'Segnalazioni',
    url: '/feedback',
    icon: "./assets/images/portolanoPo-icon-7.svg"
  },
  {
    title: 'Promotori',
    indexTitle: 'Enti',
    indexSubTitle: 'Promotori',
    url: '/credits',
    icon: "./assets/images/portolanoPo-icon-8.svg"
  }
];

// const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Portolano del Po</IonListHeader>
          <IonNote>Per tutti i naviganti del fiume Po</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.icon} className="menuIcon" />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
export {appPages};


// <IonList id="labels-list">
//   <IonListHeader>Labels</IonListHeader>
//   {labels.map((label, index) => (
//     <IonItem lines="none" key={index}>
//       <IonIcon slot="start" icon={bookmarkOutline} />
//       <IonLabel>{label}</IonLabel>
//     </IonItem>
//   ))}
// </IonList>
