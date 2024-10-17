import {useIonViewWillEnter } from '@ionic/react';
import React from 'react';
import { Device } from '@capacitor/device';


interface ContainerProps {
  pageIndex: number;
  dockIndex: number;
}

/**
This component is only used to send data to the server for metrics pourposes
*/
const PageEventHandler: React.FC<ContainerProps> = ({pageIndex, dockIndex}) => {

   useIonViewWillEnter(() =>
   {
     if (pageIndex != null)
     {
        // retrieve the device UUID, then post to server
        Device.getId()
        .then((devId:any) =>
        {
          sendMessage(devId.uuid);
        })
        .catch((error:any) =>
        {
          // nothing to do really
        });
     }
   });

   // send post req to save data
   function sendMessage(deviceId: string)
   {
     const postData = {
       pageIndex: pageIndex,
       dockIndex: dockIndex,
       userAgent: window.navigator.userAgent,
       uuid: deviceId,
       h: "gkzLoFk0MN58TGqCJj",
       act: 6
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
       .catch(error => {
         // nothing to do really
         // console.log('Problema nell\'invio del messaggio: ', error);
       });
   }

  return (
    <></>
  );
};

export default PageEventHandler;
