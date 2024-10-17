
import JsonRoutes from "../json_routes/pavia-voltagrimana.json";

export function lookAtDistance(thisDock, userCoords)
  {
      if (thisDock != null)
      {
        // test coordinates
        // let myPoint = [45.151198, 9.216014]; // vicino pavia - index 0
        // let myPoint = [45.099187, 9.505647]; // vicino castel s giovanni - index 1
        // let myPoint = [45.076466, 9.883343]; // caors o (dopo PC) - index 2
        // let myPoint = [45.108749198624601,9.937145541220749]; // isola serafini - index 3
        // let myPoint = [44.95103908017264, 10.648121526813364]; // viadana - index 4
        // let myPoint = [44.935163, 11.537498]; // ferrara - index 5
        // let myPoint = [44.980265, 12.004871]; // inizio delta - index 6
        // let myPoint = [44.954213, 12.318024]; // mezzo al delta - index 7
        // let myPoint = [45.120871, 12.249367]; // verso la laguna - index 8
        // userCoords = {latitude: myPoint[0], longitude: myPoint[1]};

        if (userCoords != null)
        {
          let myPoint = [userCoords.latitude, userCoords.longitude];
          let myDistance = 1000;
          let myIndex = 0; // in which coordinats' array the point was found?
          let myInnerIndex = 0; // in which position of the coordinate array the point was found?

          // let dockPoint = [45.0227780000,10.2266670000]; // attracco a Roccabianca (PR)
          let dockPoint = [thisDock.lat,thisDock.lng]; // attracco a Roccabianca (PR)
          let dockDistance = 1000;
          let dockIndex = 0; // in which coordinats' array the wpoint was found?
          let dockInnerIndex = 0; // in which position of the coordinate array the point was found?

          // loop trough routes points
          for (let index = 0; index < JsonRoutes.features.length; index++)
          {
            let feature = JsonRoutes.features[index];
            if (feature.geometry.coordinates !== undefined)
            {
              // find nearest point to a given point
              for (let innerIndex = 0; innerIndex < feature.geometry.coordinates[0].length; innerIndex++)
              {
                let point = feature.geometry.coordinates[0][innerIndex];
                let myTempDistance = distanceInKmBetweenEarthCoordinates(myPoint[0],myPoint[1],point[1],point[0]); // be carefull about lat/lng order (in the json file they'r inverted)
                if (myTempDistance < myDistance) // store this point
                {
                  myDistance = myTempDistance;
                  myIndex = index;
                  myInnerIndex = innerIndex;
                }

                let dockTempDistance = distanceInKmBetweenEarthCoordinates(dockPoint[0],dockPoint[1],point[1],point[0]);
                if (dockTempDistance < dockDistance) // store this point
                {
                  dockDistance = dockTempDistance;
                  dockIndex = index;
                  dockInnerIndex = innerIndex;
                }
              }
            }
          }

          let distanceSum = 0;
          // in case the 2 points are in the same array of coordinates
          if (myIndex == dockIndex)
          {
            // define start and end of the loop
            let loopStart = myInnerIndex < dockInnerIndex ? myInnerIndex : dockInnerIndex;
            let loopEnd = myInnerIndex < dockInnerIndex ? dockInnerIndex : myInnerIndex;
            for (let i = loopStart+1; i <= loopEnd; i++)
            {
              let point1 = JsonRoutes.features[myIndex].geometry.coordinates[0][i-1]; // previous point which starts as the loopStart position
              let point2 = JsonRoutes.features[myIndex].geometry.coordinates[0][i]; // current point in the loop
              distanceSum += distanceInKmBetweenEarthCoordinates(point1[1],point1[0],point2[1],point2[0]);
            }
          }
          else
          {
            // se un punto nel ramo 0 -> calcolo dist tra punto e fine ramo
            if (myIndex == 0 || dockIndex == 0)
            {
              let loopStart = myIndex == 0 ? myInnerIndex : dockInnerIndex; // the position of the user or of the dock
              let loopEnd = JsonRoutes.features[0].geometry.coordinates[0].length-1; // the number of items in the 0th array
              for (let i = loopStart+1; i <= loopEnd; i++)
              {
                let point1 = JsonRoutes.features[0].geometry.coordinates[0][i-1]; // previous point which starts as the loopStart position
                let point2 = JsonRoutes.features[0].geometry.coordinates[0][i]; // current point in the loop
                distanceSum += distanceInKmBetweenEarthCoordinates(point1[1],point1[0],point2[1],point2[0]);
              }
            }

            // se un punto nel ramo 1 o 2 -> calcolo dist tra punto e inizio ramo
            if (myIndex != 0)
            {
              let loopStart = 0; // the beginning of the branch
              let loopEnd = myInnerIndex // user's position
              for (let i = loopStart+1; i <= loopEnd; i++)
              {
                let point1 = JsonRoutes.features[myIndex].geometry.coordinates[0][i-1]; // previous point which starts as the loopStart position
                let point2 = JsonRoutes.features[myIndex].geometry.coordinates[0][i]; // current point in the loop
                distanceSum += distanceInKmBetweenEarthCoordinates(point1[1],point1[0],point2[1],point2[0]);
              }
            }

            // se un punto nel ramo 1 o 2 -> calcolo dist tra punto e inizio ramo
            if (dockIndex != 0)
            {
              let loopStart = 0; // the beginning of the branch
              let loopEnd = dockInnerIndex // user's position
              for (let i = loopStart+1; i <= loopEnd; i++)
              {
                let point1 = JsonRoutes.features[dockIndex].geometry.coordinates[0][i-1]; // previous point which starts as the loopStart position
                let point2 = JsonRoutes.features[dockIndex].geometry.coordinates[0][i]; // current point in the loop
                distanceSum += distanceInKmBetweenEarthCoordinates(point1[1],point1[0],point2[1],point2[0]);
              }
            }
          }

          // console.log("Distance betweeen the 2 points is: "+distanceSum);
          return Math.round(distanceSum) + " km";
        }
        else
        {
          return "Impossibile calcolare";
          // console.log("user coord null");
        }
      }
      else
      {
        return "Impossibile calcolare";
        // console.log("dock null");
      }
  }

  function degreesToRadians(degrees: number)
  {
    return degrees * Math.PI / 180;
  }

  function distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number)
  {
    let earthRadiusKm = 6371;

    let dLat = degreesToRadians(lat2-lat1);
    let dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadiusKm * c;
  }
