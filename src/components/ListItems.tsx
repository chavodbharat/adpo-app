import {IonList, IonListHeader, IonItem, IonLabel, IonAvatar, IonIcon, IonButton, IonSearchbar} from '@ionic/react';
import React, { useState,useEffect } from 'react';
import {mapOutline, locationOutline, openOutline } from 'ionicons/icons'
import './ListItems.css';

interface ContainerProps {
  name: string;
  elements: [any] | null;
}

const ListItems: React.FC<ContainerProps> = ({ name, elements }) => {

  const [searchText, setSearchText] = useState('');
  const [hiddenElements, setHiddenElements] = useState<[any] | null>(null);

  const urlMap10k = "https://www.adbpo.it/download/CartaPo10k_edizione2008/CartaPo10k_Tavole_pdf/";
  const urlMap50k = "https://www.adbpo.it/download/Cartog50K_PO_Portolano/";

  useEffect(() => {

    let hiddenElementsArray:[number] = [-1]; // define array of elements to be hidden

    if (elements != null) // this is still generic
    {
      // console.log("Text: "+searchText.toLowerCase());

      // filter based on input text and depending on what list are we looking at
      switch(name)
      {
          case "Attracchi":
            elements.map((element, index) => {
               if ( element.name.toLowerCase().search(searchText.toLowerCase()) == -1 &&      // search in dock name
                    element.village.toLowerCase().search(searchText.toLowerCase()) == -1 &&   // search in dock village
                    element.city.toLowerCase().search(searchText.toLowerCase()) == -1 &&      // search in dock province
                    `${element.km_tab}`.search(searchText.toLowerCase()) == -1)               // search in dock km
                 hiddenElementsArray.push(index); // hide elements
            });
          break;

          case "Mappe di Navigazione":
             elements.map((element, index) => {
                if (element.name.toLowerCase().search(searchText.toLowerCase()) == -1)  // search text
                  hiddenElementsArray.push(index); // hide elements
             });
           break;


           case "Isole naturalistiche e Rete Natura 2000":
              elements.map((element, index) => {
                if ( element.title.toLowerCase().search(searchText.toLowerCase()) == -1 &&         // search in island link name
                     (!element.description || element.description.toLowerCase().search(searchText.toLowerCase()) == -1) &&   // search in island link description
                     (!element.province || element.province.toLowerCase().search(searchText.toLowerCase()) == -1) &&      // search in island link province
                     element.region_name.toLowerCase().search(searchText.toLowerCase()) == -1 ||    // search in island link region
                     !element.province)
                   hiddenElementsArray.push(index); // hide elements
              });
            break;
        }
      }

      // console.log("to hide: ",hiddenElementsArray);
      setHiddenElements(hiddenElementsArray); // set array of elements to be hidden
    }, [elements, searchText])

  switch(name)
  {
    case "Attracchi":
    return (
      <>
      <IonSearchbar placeholder="Cerca attracco" showCancelButton="never" value={searchText} onIonChange={e => setSearchText(e.detail.value!)} animated={true} ></IonSearchbar>
        <IonList>
          {elements != null &&
            elements.map((element, index) => {
              return (
                <span key={index}>
                {(hiddenElements == null || hiddenElements.indexOf(index) == -1) && // show only elements not in the array
                  <IonItem button={true} href={`/dock/${index}`} >
                   {/*<IonAvatar slot="start">
                     <img src="./avatar-finn.png" />
                   </IonAvatar>*/}
                   <IonLabel>
                     <h2>{element.name}</h2>
                     <h3>{element.village} ({element.province})</h3>
                     <p>km {element.km_tab}</p>
                   </IonLabel>
                   <IonButton href={`/docksMap/${index}`} fill="clear" size="large">
                    <IonIcon slot="end" icon={locationOutline} className="dockButton" ></IonIcon>
                   </IonButton>
                 </IonItem>
               }
               </span>
              )
           })
         }
        </IonList>
      </>
    );
    case "Mappe di Navigazione":
    return (
      <>
        <IonSearchbar placeholder="Cerca mappa" showCancelButton="never" value={searchText} onIonChange={e => setSearchText(e.detail.value!)} animated={true} ></IonSearchbar>
        <IonList>
          {elements != null &&
            elements.map((element, index) => {
              return (
                <span key={index}>
                {(hiddenElements == null || hiddenElements.indexOf(index) == -1) && // show only elements not in the array
                  <IonItem key={index} button={false} >
                   <IonLabel>
                     <h2 className="mapLabels">
                      {element.map.indexOf("10K") > -1 ? element.name.substr(31) : element.name.substr(19)}
                     </h2>
                   </IonLabel>
                   <IonButton target="_blank" rel="noreferrer" href={(element.map.indexOf("10K") > -1 ? urlMap10k : urlMap50k) + element.map} fill="clear" size="large">
                    <IonIcon slot="end" icon={mapOutline} className={(element.map.indexOf("10K") > -1 ? "mapButton10k" : "mapButton50k")}></IonIcon>
                   </IonButton>
                 </IonItem>
               }
               </span>
              )
           })
         }
        </IonList>
      </>
    );
    case "Isole naturalistiche e Rete Natura 2000":
    return (
      <>
        <IonSearchbar placeholder="Cerca area naturalistica" showCancelButton="never" value={searchText} onIonChange={e => setSearchText(e.detail.value!)} animated={true} ></IonSearchbar>
        <IonList>
          {elements != null &&
            elements.map((element, index) => {
              return (
                <span key={index}>
                {(hiddenElements == null || hiddenElements.indexOf(index) == -1) && // show only elements not in the array
                  <IonItem key={index} button={false} >
                   <IonLabel>
                     <h2>{element.title}</h2>
                   </IonLabel>
                   <IonButton target="_blank" rel="noreferrer" href={element.url} fill="clear" size="large">
                    <IonIcon slot="end" icon={openOutline} ></IonIcon>
                   </IonButton>
                 </IonItem>
               }
               </span>
              )
           })
         }
        </IonList>
      </>
    );
    default:
      return (
        <div className="container">
          <strong>{name}</strong>
        </div>
      );
  }

};

export default ListItems;
