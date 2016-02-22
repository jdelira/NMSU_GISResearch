      var map = null;
      var greenLayer;
      
     
      var testDataGenerator = new function () 
      {

        /*
        * Example data model that may be returned from a custom web service.
        * constructor
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
          var data = [], pointLatitude, pointLongitude;

          for (var i = 0; i < numPoints; i++)
          {
              //randomLatitude = Math.random() * 181 - 90;
              //randomLongitude = Math.random() * 361 - 180;
              
              data.push(new exampleDataModel("Point: " + i, pointlatitude, pointlongitude));
          }

          if (callback) {
              callback(data);
          }
      };
  };
      var query; 
      var queryKey = '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u';
      var address;
      var currInfobox;
      var addressNums;
      var addressWONums;
      var newAddressNumUp; var newAddressUp;
      var newAddressNumDown; var newAddressDown;
      var southLatitude = 0;
      var westLongitude = 0;
      var northLatitude = 0;
      var eastLongitude = 0;
      var maxSearch = 1000;
      var array1 = [];
      function getMap()
      {
        //var boundingBox = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(47.618594, -122.347618), new Microsoft.Maps.Location(47.620700, -122.347584), new Microsoft.Maps.Location(47.622052, -122.345869));
        map = new Microsoft.Maps.Map(document.getElementById('myMap'), {credentials: '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u', enableSearchLogo: false, showDashboard: false});
        
        registerClusterModule();
      }
      
      
      function findLocation()
      {
          
          
                address = document.getElementById('searchBox').value;
                addressWONums = address.substring(address.indexOf(" ")+1, address.length);
                addressNums = address.substring(0, address.indexOf(" "));
                
                for(var i = 0; i < maxSearch; i++)
                {
                     if(i == 0)
                        {
                           newAddressNumUp = Number(addressNums) + 1;
                           newAddressNumDown = Number(addressNums) - 1; 
                        }
                        else
                        {
                           newAddressNumUp++;
                           newAddressNumDown--;
                        }     
                        newAddressUp = newAddressNumUp + " " + addressWONums;
                        newAddressDown = newAddressNumDown + " "+ addressWONums;


                        array1.push(newAddressUp);
                        if(newAddressNumDown > 0)
                        {
                            array1.push(newAddressDown);
                        }
                }
        
                query= document.getElementById('searchBox').value;
                findListHomes(array1);
    }
    
    function findListHomes(a)
    {
        map.getCredentials(callSearchService);
            for(var i = 0; i < a.length; i++)
            {
                    query= a[i];
                    map.getCredentials(callSearchService);  
            }
    }
        
     

      function callSearchService(credentials) 
      {
          
          var searchRequest = 'https://dev.virtualearth.net/REST/v1/Locations/' + query + '?output=json&jsonp=searchServiceCallback&key=' + credentials;
          var mapscript = document.createElement('script'); 
          mapscript.type = 'text/javascript'; 
          mapscript.src = searchRequest; 
          document.getElementById('myMap').appendChild(mapscript);
      }

      function searchServiceCallback(result)
      {
    
          if (result &&
          result.resourceSets &&
          result.resourceSets.length > 0 &&
          result.resourceSets[0].resources &&
          result.resourceSets[0].resources.length > 0 && result.resourceSets[0].resources[0].geocodePoints[0].calculationMethod == "Parcel") 
          {

              var bbox = result.resourceSets[0].resources[0].bbox;
              northLatitude = result.resourceSets[0].resources[0].point.coordinates[0] + 0.003;
              westLongitude = result.resourceSets[0].resources[0].point.coordinates[1] - 0.006;
              southLatitude = result.resourceSets[0].resources[0].point.coordinates[0] - 0.003;
              eastLongitude = result.resourceSets[0].resources[0].point.coordinates[1] + 0.006;
              
              var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
              var pin = new Microsoft.Maps.Pushpin(location);
              Microsoft.Maps.Events.addHandler(pin, 'click', function () { showInfoBox(result); });
              map.entities.push(pin);
              
              var spatialFilter = 'spatialFilter=bbox(' + southLatitude + ',' +  westLongitude + ',' + northLatitude + ',' + eastLongitude + ')';
              var select = '$select=*';
              var format = '$format=json';
              var skip = '$skip=0';
              var top = '$top=100';
              var sdsRequest = 'http://spatial.virtualearth.net/REST/v1/data/f22876ec257b474b82fe2ffcb8393150/NavteqNA/NavteqPOIs?' + spatialFilter + '&' + select + '&' + format + '&' + skip + '&' + top + '&' +  'jsonp=SDSServiceCallback' + '&key=' + queryKey;
              
              var mapscript2 = document.createElement('script');
              mapscript2.type = 'text/javascript';
              mapscript2.src = sdsRequest;
              document.getElementById('myMap').appendChild(mapscript2);
             
    
          }
      }
      
       function SDSServiceCallback(result) 
       {
         var viewRect = Microsoft.Maps.LocationRect.fromEdges(northLatitude, westLongitude, southLatitude, eastLongitude);
         map.setView({ bounds: viewRect });
         
         query_onQuerySuccess(result['d']);
       };

      function query_onQuerySuccess(result) 
      {
          var searchResults = result && result["results"];
          if (searchResults) 
          {
              if (searchResults.length == 0) 
              {
                  alert("No results for the query");
              }
              else 
              {
                  for (var i = 0; i < searchResults.length; i++) 
                  {
                    
                      createPin(searchResults[i]);
                  }
              }
          }
      }
      
      
      
      
      
      
      function customModuleLoaded()
      {
        greenLayer = new ClusteredEntityCollection(map, {
        singlePinCallback: createPin,
        clusteredPinCallback: createClusteredPin
        });                                                    //value is # points to plot
        setTimeout(function(obj) { testDataGenerator.generateData(200,requestGreenDataCallback); }, 2000, testDataGenerator);
      }   
      
      function requestGreenDataCallback(response) 
      {
        if (response !== null) 
        {
            //This method is part of dynamically downloaded clustering Module V7ClientSideClustering.js.
            greenLayer.SetData(response);
        }
      }
      
      
      /* arg1: pass cluster value
       * arg2: pass latlong object value
       */
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
      
      
      
      function createPin(result) 
      {
          if (result) 
          {
              var location = new Microsoft.Maps.Location(result.Latitude, result.Longitude);
              var pin = new Microsoft.Maps.Pushpin(location);
              Microsoft.Maps.Events.addHandler(pin, 'click', function () { showInfoBox2(result); });
              map.entities.push(pin);
              
              return pin;
          }
          
      }


      
      function showInfoBox2(result) 
      {
          if (currInfobox) 
          {
              map.entities.remove(currInfobox);
          }

          var location = new Microsoft.Maps.Location(result.Latitude, result.Longitude);
          var decription = [];

          for (var item in result) 
          {
                if (item === '__copyright' || item === '__metadata') 
                {
                  continue;
                }

              decription.push(item + ":" + result[item] + "<br/>");
          }

          currInfobox = new Microsoft.Maps.Infobox(location,
               { title: "Title", description: decription.join(' '), showPointer: true});

          currInfobox.setOptions({ visible: true });
          map.entities.push(currInfobox);
      }   

      
      function showInfoBox(result)
      {
         
          if (currInfobox) 
          {
              map.entities.remove(currInfobox);
          }
          var pix = map.tryLocationToPixel(result.resourceSets[0].resources[0].point.coordinates, Microsoft.Maps.PixelReference.control);
          //var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
          
           //switch title back to result.resourceSets[0].resources[0].entityType + " "
          currInfobox = new Microsoft.Maps.Infobox(result.resourceSets[0].resources[0].point.coordinates,{title: result.resourceSets[0].resources[0].geocodePoints[0].calculationMethod + " ", description: result.resourceSets[0].resources[0].name + " ", showPointer: true, });

          currInfobox.setOptions({ visible: true });
          map.entities.push(currInfobox);
      }
      
      
      function registerClusterModule()
      {
       Microsoft.Maps.registerModule('clusterModule', 'https://www.bingmapsportal.com/scripts/V7ClientSideClustering.js');
      }
      
      function loadClusterModule()
      {
       Microsoft.Maps.loadModule('clusterModule', { callback: customModuleLoaded });
      }