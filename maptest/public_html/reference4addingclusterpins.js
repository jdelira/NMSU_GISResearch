
      var map = null;
      var greenLayer;
      var testDataGenerator = new function () 
      {

        /*
        * Example data model that may be returned from a custom web service.
        */
        var exampleDataModel = function (name, latitude, longitude) {
            this.Name = name;
            this.Latitude = latitude;
            this.Longitude = longitude;
        };


    /*
    * This function generates a bunch of random random data with 
    * coordinate information and returns it to a callback function 
    * similar to what happens when calling a web service.
    */
    this.generateData = function (numPoints, callback) 
    {
          var data = [], randomLatitude, randomLongitude;

          for (var i = 0; i < numPoints; i++)
          {
              randomLatitude = Math.random() * 181 - 90;
              randomLongitude = Math.random() * 361 - 180;
              data.push(new exampleDataModel("Point: " + i, randomLatitude, randomLongitude));
          }

          if (callback) {
              callback(data);
          }
      };
  };
  
  
      function displayInfo(e) 
      {
          if (e.targetType == "pushpin") 
          {
              showInfobox(e.target);
          }
      }

      function showInfobox(shape) 
      {
       for (var i = map.entities.getLength() - 1; i >= 0; i--) 
       {
        var pushpin = map.entities.get(i);
        if (pushpin.toString() == '[Infobox]')
        {
            map.entities.removeAt(i);
        };
      }
        var pix = map.tryLocationToPixel(shape.getLocation(), Microsoft.Maps.PixelReference.control);
        var infoboxOptions = { width: 170, height: 80, showCloseButton: true, zIndex: 10, offset: new Microsoft.Maps.Point(10, 0), showPointer: true, title: shape.title, description: shape.description };
        var defInfobox = new Microsoft.Maps.Infobox(shape.getLocation(), infoboxOptions);
        map.entities.push(defInfobox);
      }
            
      function customModuleLoaded()
      {
      greenLayer = new ClusteredEntityCollection(map, {
      singlePinCallback: createPin,
      clusteredPinCallback: createClusteredPin
      });
      setTimeout(function(obj) { testDataGenerator.generateData(200,requestGreenDataCallback); }, 2000, testDataGenerator);
      }      
      
      function requestGreenDataCallback(response) 
      {
      if (response != null) {
      //This method is part of dynamically downloaded clustering Module V7ClientSideClustering.js.
      greenLayer.SetData(response);
      }

      function createClusteredPin(cluster, latlong)
      {
        var pin = new Microsoft.Maps.Pushpin(latlong, {
        icon: '/content/images/clusteredpin.png',
        anchor: new Microsoft.Maps.Point(8, 8)
        });
        pin.title = 'Cluster pin';
        pin.description = 'Cluster Size: ' + cluster.length ;
        Microsoft.Maps.Events.addHandler(pin, 'click', displayInfo);
        return pin;
      }
      
       function createPin(data) 
       {
        var pin = new Microsoft.Maps.Pushpin(data._LatLong, {
        icon: '/content/images/nonclusteredpin.png',
        anchor: new Microsoft.Maps.Point(8, 8)
        });
        pin.title = 'Single pin';
        pin.description = 'GridKey: ' + data.GridKey;
        Microsoft.Maps.Events.addHandler(pin, 'click', displayInfo);
        return pin;
      }
