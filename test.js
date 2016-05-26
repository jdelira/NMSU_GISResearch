/* global Microsoft */


var map = null;
var query;
var queryKey = '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u';
var originAddress;
var currentAddress;
var maxUnver;
var minUnver;
var max;
var smallestOriginValidAddress; var largestOriginValidAddress; var smallestValidAddress; var largestValidAddress;
var min;
var currInfobox;
var addressNums;
var addressWONums;
var newAddress;
var newAddressWONums;
var newAddressNum;
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
var streetname; var streetnameSuffix; var cityname; var statename;
var maxSearches = 0;
var searchCount = 0;
var arrayOfStreetnames = [];
var lowRangeHitZero = false;
var haveSurroundingStreets = false;
var firstValidAddressHit = false;
var rangeCalculated = false;
var searchReady = false;
var searchComplete = false;
var firstSearch = true;
var bboxCalculated = false;
var maxRangeHitCount = 0;

function getMap()
{
    //var boundingBox = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(47.618594, -122.347618), new Microsoft.Maps.Location(47.620700, -122.347584), new Microsoft.Maps.Location(47.622052, -122.345869));
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {credentials: '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u', enableSearchLogo: false, showDashboard: false});

}

  
function main()
{
    if (firstSearch)
    {  
        if(!bboxCalculated)
        {
            setTimeout(setBbox(),100);
        }
        else if(!haveSurroundingStreets)
        {
            setTimeout(getSurroundingStreets(),100);
        }
        else
        {
            getOriginLocation();
        }
        
    } else if(!rangeCalculated)
    {
        setTimeout(findAddressRange(), 100);
    }
    else if(!searchReady)
    {
        setTimeout(generateAddressField(),100);
    }
    else if(!searchComplete)
    {
        setTimeout(validateAddressField(), 100);
    }
    else
    {
            if(arrayOfStreetnames.length > 0)
            {
              
                alert("not done");
                homes = [];
                searchCount = 0;
                maxRangeHitCount = 0;
                lowRangeHitZero = false;
                firstValidAddressHit = false;
                rangeCalculated = false;
                searchReady = false;
                searchComplete = false;
                //max # searches for given street without known address range 
                maxSearches = Math.pow(10, addressNums.length -1);
                setTimeout(getNewLocation(),100);
            }
            else
            {
                alert("done");
            }
        
    }

    
}

function setBbox()
{
    query = document.getElementById('searchBox').value;
    map.getCredentials(callSearchService);
}

function getSurroundingStreets()
{
     /**********************OSM RETRIEVAL CODE ******************************/
            var osmData = new XMLHttpRequest();
            //will return php address results
            osmData.onload = function () {
                //This is where you handle what to do with the response.
                //The actual data is found on this.responseText

                var stringOfAddresses = this.responseText;
                
                haveSurroundingStreets = true;
                arrayOfStreetnames = stringOfAddresses.split(',');
                main();
                //outputs all street names within the specified bbox
                //console.log(arrayOfStreetnames);

            }; //END ONLOAD



            /**********************OSM DATA REQUEST CODE ****************************/
            //utilizes previously declared coordinates 
            var variableString = "southlat=" + southLatitude + "&westlong=" + westLongitude + "&northlat=" + northLatitude + "&eastlong=" + eastLongitude;
            osmData.open("GET", "getOSMData.php?" + variableString, true);
            osmData.send();
            /**********************************************************************************/
}

function getOriginLocation()
{
    originAddress = document.getElementById('searchBox').value;
    addressWONums = originAddress.substring(originAddress.indexOf(" ") + 1, originAddress.length);
    addressNums = originAddress.substring(0, originAddress.indexOf(" "));
    addressRangeService(originAddress);
}


function getNewLocation()
{
    newAddressNum = smallestOriginValidAddress - 1;
    addressWONums = arrayOfStreetnames[arrayOfStreetnames.length -1] + ", " + cityname;
    newAddress = newAddressNum + " " + addressWONums;
    arrayOfStreetnames.length--;
    addressRangeService(newAddress); 
}



//finds smallest, then largest address range for given street
function findAddressRange()
{
    
    if(smallestValidAddress == null)
    {
        //alert("finding smallest valid address");
        findSmallestAddress();
    }
    else if(largestValidAddress == null)
    {
        //alert("finding largest valid address");
        findLargestAddress();
    }
    else
    {
       /* if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        */
        
        var lowAddressPlaceholder = "lowaddress=";
        var lowAddressVariable = smallestValidAddress;
        var highAddressPlaceholder = "highaddress=";
        var highAddressVariable = largestValidAddress;
        var streetnamePlaceholder = "streetname=";
        var streetnameVariable = streetname + " " + streetnameSuffix;
        var cityPlaceholder = "city=";
        var cityVariable =  cityname;
        var statePlaceholder = "state=";
        var stateVariable = statename;
        var PageToSendTo = "insertNewAddress.php?";
        var url = PageToSendTo + lowAddressPlaceholder +  lowAddressVariable + "&" + highAddressPlaceholder +  highAddressVariable + "&" + streetnamePlaceholder +  streetnameVariable + "&" + cityPlaceholder +  cityVariable + "&"  + statePlaceholder +  stateVariable;


         /*xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                alert(xmlhttp.responseText);
            }
        };


        xmlhttp.open("GET", url, true);
        xmlhttp.send();*/
        
        
       rangeCalculated = true;
        main();
    }
    
}

function findSmallestAddress()
{
    if(min - 1 > 0 || newAddressNum - 1 > 0)
    {
        if(firstValidAddressHit)
        {
            //alert("firstValidAddressHit");
            minUnver =  min - 1;
            currentAddress = minUnver + " " + addressWONums;
            addressRangeService(currentAddress);
        }
        else
        {
            if(searchCount < maxSearches && maxRangeHitCount == 0)
            {
                //alert("firstValidAddress not hit, running through low range");
                searchCount++;
                newAddressNum--;
                currentAddress = newAddressNum + " " + addressWONums;
                addressRangeService(currentAddress);
            }
            else
            {
                maxRangeHitCount++;
                if(maxRangeHitCount == 1)
                {
                    searchCount = 0;
                }
                //alert("firstValidAddress not hit, running through high range");
                findLargestAddress();
                
            }
        }
    }
    else
    {
        if(lowRangeHitZero)
        {
             findLargestAddress();
        }
        else
        {
            lowRangeHitZero = true;
            searchCount = 0;
            findLargestAddress();
        }
       
    }
        
}

function findLargestAddress()
{
    
        if(firstValidAddressHit)
        {
            maxUnver =  max + 1;
            currentAddress = maxUnver + " " + addressWONums;
             addressRangeService(currentAddress);
        }
        else
        {
            if(searchCount < maxSearches)
            {
                if(searchCount == 0)                {
                    newAddressNum = largestOriginValidAddress + 1;
                }
                else
                {
                     newAddressNum++;
                }
               
                currentAddress = newAddressNum + " " + addressWONums;
                addressRangeService(currentAddress);
            }
            else
            {
               alert("address range could not be found for " + arrayOfStreetnames[arrayOfStreetnames.length -1] );
            }
        }
        
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
                
                if(!firstValidAddressHit)
                {
                     firstValidAddressHit = true;
                }
                    
                
                //alert(json.result.addressMatches[0].matchedAddress);
                censusData[0] = json.result.addressMatches[0].addressComponents.fromAddress;
                censusData[1] = json.result.addressMatches[0].addressComponents.toAddress;
                censusData[2] = json.result.addressMatches[0].addressComponents.streetName;
                censusData[3] = json.result.addressMatches[0].addressComponents.suffixType; //Rd, Ln, St, etc..
                censusData[4] = json.result.addressMatches[0].addressComponents.city;
                censusData[5] = json.result.addressMatches[0].addressComponents.state;
                
                
                streetname = censusData[2];
                streetnameSuffix = censusData[3];
                cityname = censusData[4];
                statename = censusData[5];
                
                min = Number(censusData[0]);
                max = Number(censusData[1]);

            }
        } catch (e)
        {

            if(firstValidAddressHit)
            {      
                //find address number that is not valid for inputted address
                var val  = Number(json.result.input.address.address.substring(0, currentAddress.indexOf(" ")));
                //check if max or min address # hit for given street
                if(val == minUnver)
                {
                    if(originAddress.indexOf(streetname) !== -1)
                    {
                        smallestOriginValidAddress = min;
                    }
                    smallestValidAddress = min;
                }
                else
                {
                    if(originAddress.indexOf(streetname) !== -1)
                    {
                        largestOriginValidAddress = max;
                    }
                    largestValidAddress = max;
                }
            }
            else if(firstSearch)
            {
                    alert("Sorry, we could not find " + '"' + json.result.input.address.address + '"');
            }



        }

        main();
    }
}


//creates array with finalized address range for given street
function generateAddressField()
{
    var low = smallestValidAddress;
    var high = largestValidAddress;
    
    while(low <= high)
    {
        newAddressUp = low + " " + addressWONums;
        homes.push(newAddressUp);
        low++;
    }
    searchReady = true;
    main();
}

function validateAddressField()
{

    for(var x = 0; x < homes.length; x++)
    {
        query = homes[x];
        map.getCredentials(callSearchService);
    }
    
    searchComplete = true;
    main();
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

        if (countCenter == 0)
        {
            countCenter++;
            northLatitude = result.resourceSets[0].resources[0].point.coordinates[0] + 0.003;
            westLongitude = result.resourceSets[0].resources[0].point.coordinates[1] - 0.006;
            southLatitude = result.resourceSets[0].resources[0].point.coordinates[0] - 0.003;
            eastLongitude = result.resourceSets[0].resources[0].point.coordinates[1] + 0.006;
            bboxCalculated = true;
            main();
        }
        else
        {
             var viewRect = Microsoft.Maps.LocationRect.fromEdges(northLatitude, westLongitude, southLatitude, eastLongitude);
            map.setView({bounds: viewRect});
            
            
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
    currInfobox = new Microsoft.Maps.Infobox(location, {title: result.resourceSets[0].resources[0].geocodePoints[0].calculationMethod + " ", description: result.resourceSets[0].resources[0].name + " ", showPointer: true});

    currInfobox.setOptions({visible: true});
    map.entities.push(currInfobox);
}


  