import {IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonItem, IonImg} from '@ionic/react';
import {appPages} from './Menu'

import './ExploreContainer.css';

const ExploreContainer: React.FC = () => {
  return (
    <div>
      <IonGrid>
        <IonRow>
          {appPages.map((appPage, index) => {
            if (index > 0)
            return (
                <IonCol key={index} size="6">
                  <IonCard button={true} color="light" href={appPage.url} className={index % 2 == 0 ? "darkCard" : "lightCard"} >
                    <IonItem className="cardItem ion-padding-top" lines="none">
                      <IonIcon icon={appPage.icon} className="indexIcon" />
                    </IonItem>
                    <IonCardHeader>
                      <IonCardTitle>{appPage.indexTitle}</IonCardTitle>
                      <IonCardSubtitle>{appPage.indexSubTitle}</IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>
      <div className="footerBar">
        <a href="https://www.agenziapo.it" target="_blank"><IonImg class="ion-margin" slot="start" alt="Logo AIPO" src="assets/images/logo_aipo_b2.png" id="logoAipo" /></a>
        <a href="https://www.adbpo.it" target="_blank"><IonImg class="ion-margin" slot="start" alt="Logo ADBPO" src="assets/images/logo-adbpo-wide.png" id="logoAdbpo" /></a>
      </div>
    </div>
  );
};

export default ExploreContainer;

/*
light blue: 4195bf
dark blue: 0f5783
*/
