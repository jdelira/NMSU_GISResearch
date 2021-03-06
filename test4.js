/* global Microsoft */

//ENTITY TYPE ID
//4444 - named place
//9590 - residential area/building
var map = null;
var query;
var queryKey = '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u';
var originAddress;
var currentAddress;
var invalidRange = false;
var maxUnver;
var minUnver;
var max;
var smallestValidAddress; var largestValidAddress;
var min;
var currInfobox;
var addressNums;
var addressWONums;
var newAddressNumUp;
var newAddressUp;
var newAddressNumDown;
var newAddressDown;
var southLatitude = 0;
var westLongitude = 0;
var northLatitude = 0;
var eastLongitude = 0;
var homes = [];
var censusData = [];
var countCenter = 0;
var addressRangeCounter = 0;
var addressRangeCounter2 = 0;
var firstSearch = true;


function getMap()
{
    //var boundingBox = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(47.618594, -122.347618), new Microsoft.Maps.Location(47.620700, -122.347584), new Microsoft.Maps.Location(47.622052, -122.345869));
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {credentials: '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u', enableSearchLogo: false, showDashboard: false});

}


function main()
{
    if (firstSearch)
    {
        findOriginLocation();
    } else
    {
        setTimeout(findNewLocation(), 100);
    }
}




function findOriginLocation()
{
    originAddress = document.getElementById('searchBox').value;
    addressWONums = originAddress.substring(originAddress.indexOf(" ") + 1, originAddress.length);
    addressNums = originAddress.substring(0, originAddress.indexOf(" "));
    addressRangeService(originAddress);
}



function findNewLocation()
{
    
    if(smallestValidAddress == null)
    {
        minUnver =  min - 1;
        currentAddress = minUnver + " " + addressWONums;
        addressRangeService(currentAddress);
    }
    else
    {
        alert(smallestValidAddress);
        return;
    }
        //maxUnver = max + 1;
        
        
         

  
}

//sets up query to uscensus one line address search api
function addressRangeService(currentAddress)
{
    //set its source api to the JSONP API
    var USCensusSearch = "http://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=" + currentAddress + "&benchmark=Public_AR_Current" + "&format=jsonp" + "&callback=addressRangeCallback";
    //create a new script element
    var censusReturn = document.createElement('script');
    //set its source api to the JSONP API
    censusReturn.type = 'text/javascript';
    censusReturn.src = USCensusSearch;
    //stick the script element in the page myMap
    document.getElementById('myMap').appendChild(censusReturn);

}



function addressRangeCallback(json)
{

    if (json)
    {

        try {

            //address is within valid range for given street #
            if (typeof json.result.addressMatches[0].matchedAddress !== 'undefined')
            {
                
                if(firstSearch)
                {
                    firstSearch = false;
                }
                
                //alert(json.result.addressMatches[0].matchedAddress);
                censusData[0] = json.result.addressMatches[0].addressComponents.fromAddress;
                censusData[1] = json.result.addressMatches[0].addressComponents.toAddress;
                censusData[2] = json.result.addressMatches[0].addressComponents.streetName;
                censusData[3] = json.result.addressMatches[0].addressComponents.suffixType; //Rd, Ln, St, etc..
                censusData[4] = json.result.addressMatches[0].addressComponents.city;
                censusData[5] = json.result.addressMatches[0].addressComponents.zip;

                min = Number(censusData[0]);
                max = Number(censusData[1]);

            }
        } catch (e)
        {


            if (firstSearch)
            {
                alert("Sorry, we could not find " + '"' + json.result.input.address.address + '"');
            }
            else
            {
                //find address # of address that is not valid
                addressNums = Number(json.result.input.address.address.substring(0, originAddress.indexOf(" ")));
                //check if max or min address # hit for given street
                if(addressNums == minUnver)
                {
                    smallestValidAddress = min;
                }
                else
                {
                    largestValidAddress = max;
                }
                
            }



        }

        main();
    }
}


//creates array with finalized address range for given street
function generateAddress()
{
    //newAddressUp = from + " " + addressWONums;
    //homes.push(newAddressUp);
    /*
     for (var i = from; i < to; i++)
     {
     
     newAddressUp = (i + 1) + " " + addressWONums;
     homes.push(newAddressUp);
     
     }
     
     */
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

        //addressRangeCounter2++;
        //console.log(addressRangeCounter2 + " in if");


        if (countCenter == 0)
        {
            northLatitude = result.resourceSets[0].resources[0].point.coordinates[0] + 0.003;
            westLongitude = result.resourceSets[0].resources[0].point.coordinates[1] - 0.006;
            southLatitude = result.resourceSets[0].resources[0].point.coordinates[0] - 0.003;
            eastLongitude = result.resourceSets[0].resources[0].point.coordinates[1] + 0.006;


            var viewRect = Microsoft.Maps.LocationRect.fromEdges(northLatitude, westLongitude, southLatitude, eastLongitude);
            map.setView({bounds: viewRect});
            countCenter++;
        }



        var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
        var pin = new Microsoft.Maps.Pushpin(location);
        Microsoft.Maps.Events.addHandler(pin, 'click', function () {
            showInfoBox(result);
        });
        map.entities.push(pin);

        /*var spatialFilter = 'spatialFilter=bbox(' + southLatitude + ',' + westLongitude + ',' + northLatitude + ',' + eastLongitude + ')';
         var select = '$select=*';
         var format = '$format=json';
         var sdsRequest = 'http://spatial.virtualearth.net/REST/v1/data/f22876ec257b474b82fe2ffcb8393150/NavteqNA/NavteqPOIs?' + spatialFilter + '&' + select + '&' + format + '&' + 'jsonp=SDSServiceCallback' + '&key=' + queryKey;
         
         var mapscript2 = document.createElement('script');
         mapscript2.type = 'text/javascript';
         mapscript2.src = sdsRequest;
         document.getElementById('myMap').appendChild(mapscript2);
         */





    }
}

/* function SDSServiceCallback(result)
 {
 var viewRect = Microsoft.Maps.LocationRect.fromEdges(northLatitude, westLongitude, southLatitude, eastLongitude);
 map.setView({bounds: viewRect});
 
 query_onQuerySuccess(result['d']);
 }*/


function query_onQuerySuccess(result)
{
    var searchResults = result && result["results"];
    if (searchResults)
    {
        if (searchResults.length === 0)
        {
            alert("No results for the query");
        } else
        {
            for (var i = 0; i < searchResults.length; i++)
            {

                createMapPin(searchResults[i]);
            }
        }
    }
}


function createMapPin(result)
{
    if (result)
    {
        var location = new Microsoft.Maps.Location(result.Latitude, result.Longitude);
        var pin = new Microsoft.Maps.Pushpin(location);
        Microsoft.Maps.Events.addHandler(pin, 'click', function () {
            showInfoBox2(result);
        });
        map.entities.push(pin);
    }
}



function showInfoBox2(result) {
    if (currInfobox) {
        map.entities.remove(currInfobox);
    }

    var location = new Microsoft.Maps.Location(result.Latitude, result.Longitude);
    var decription = [];

    for (var item in result) {
        if (item === '__copyright' || item === '__metadata') {
            continue;
        }

        decription.push(item + ":" + result[item] + "<br/>");
    }

    currInfobox = new Microsoft.Maps.Infobox(location,
            {title: "Title", description: decription.join(' '), showPointer: true});

    currInfobox.setOptions({visible: true});
    map.entities.push(currInfobox);
}


function showInfoBox(result)
{
    if (currInfobox)
    {
        map.entities.remove(currInfobox);
    }

    var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);

    //switch title back to result.resourceSets[0].resources[0].entityType + " "
    currInfobox = new Microsoft.Maps.Infobox(location, {title: result.resourceSets[0].resources[0].geocodePoints[0].calculationMethod + " ", description: result.resourceSets[0].resources[0].name + " ", showPointer: true, });

    currInfobox.setOptions({visible: true});
    map.entities.push(currInfobox);
}


  