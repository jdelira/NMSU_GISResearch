/* global Microsoft */


var map = null;
var query;
var queryKey = '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u';
var currInfobox;
var southLatitude = 0;
var westLongitude = 0;
var northLatitude = 0;
var eastLongitude = 0;
var countCenter = 0;
var pinCollection = new Microsoft.Maps.EntityCollection();
var addressNums;
var addressWONums;
var addressList;



var originAddress;
var originAddressNums;
var originAddressWONums;
var originStreetname;

var currentAddress;
var currentMax;
var currentMin;
var counter = 0;

var smallestOriginValidAddress;
var smallestValidAddress;
var largestOriginValidAddress;
var largestValidAddress;
var totalOriginBuildings = 0;
var totalBuildings = 0;
var averageAddressDifference = 0;

var homes = [];
var censusData = [];
var arrayOfStreetnames = [];
var streetname;
var streetnameSuffix;
var cityname;
var statename;
var streetnameToLowercase;

var maxAllowedSearches = 0;
var lowRangeSearches = 0;
var highRangeSearches = 0;
var lowRangeHitZero = false;
var haveSurroundingStreets = false;
var firstValidAddressHit = false;
var firstAddressSearchValidateAttempt= false;
var firstAddressSearchValidateAttempResult;
var rangeCalculated = false;
var searchReady = false;
var searchComplete = false;
var firstAddressSearch = true;
var bboxCalculated = false;
var DBChecked = false;
var addressPrepared = false;
var inLocalDB = false;
var foundSmallestAddressNum = false;
var foundLargestAddressNum = false;
var DBResponse;
var buildingTimeCounter = 0;
var testCounter = 0;
var firstAddressHitCount = 0;
var consecutiveMisses;
var addressDiffMultiple;
var addressInsertedToDB;




function getMap()
{
    //var boundingBox = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(47.618594, -122.347618), new Microsoft.Maps.Location(47.620700, -122.347584), new Microsoft.Maps.Location(47.622052, -122.345869));
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {credentials: '1TrPvFu5XUNIYRG3slGE~g1DeVC-r074_2Yn63QMH8Q~AvtN87-ebJjpBC5ClqBwbszhQfogB7hsKce2QUNNvtfgdKqRqTOpJ68yzUpYud2u', enableSearchLogo: false, showDashboard: false});

}


function main()
{
    if (firstAddressSearch)
    {
        console.log("user-input address about to be searched");
        if (!firstAddressSearchValidateAttempt)
        {
            console.log("validating user-input address");
            validateFirstAddress();
        }
        else if(firstAddressSearchValidateAttempResult === undefined)
        {
            console.log("firstAddressSearchValidateAttemptResult is undefined");
           main();
        }
        else
        {
            console.log("setting first address search to false");
            firstAddressSearch = false;
            setTimeout(main,50);
        }

    }
    else if (!bboxCalculated)
    {
        console.log("calculating bbox");
        setBbox();
    } else if (!haveSurroundingStreets)
    {
        console.log("finding surrounding streets");
        getSurroundingStreets();
    } else if(!DBChecked)
    {
          console.log("checking for " + streetname + "  in Database");
          getAddressRange();
    } else if(!inLocalDB)
    {
        //console.log("not in local DB");
           if(!firstValidAddressHit)
           {
               console.log("trying to find first valid address with address as: \n" + streetname);
               if(firstAddressHitCount == 0)
               {
                   console.log("getting location");
                   getLocation();
               }
               else
               {
                   setTimeout(getLocation(),firstAddressHitCount * 100);
               }
               firstAddressHitCount++;
               
           }
           else if(!rangeCalculated)
           {
               console.log("calculating range");
               setAddressRange();
           }
           else if(!searchReady)
            {
                console.log("generating address field for " + streetname);
                generateAddressField();
            }
            else if(!searchComplete)
            {
                console.log("validating addres field for " + streetname);
                validateAddressField();
            }
            else if(addressList > 0 && testCounter < 3)
            {
                
                if(totalOriginBuildings === 0)
                {
                    console.log("# buildings is zero");
                    totalBuildings = totalOriginBuildings;
                    setTimeout(main, 100);
                }
                else if(totalOriginBuildings  > totalBuildings)
                {
                    totalBuildings = totalOriginBuildings;
                    buildingTimeCounter++;
                    console.log(totalOriginBuildings + " buildings have been found");
                    setTimeout(main,buildingTimeCounter * 1000);
                }
                else
                {
                    if(testCounter == 0)
                    {
                        averageAddressDifference = Math.ceil((largestValidAddress - smallestValidAddress)/totalOriginBuildings);
                    }
                    
                    console.log(largestValidAddress);
                    console.log(smallestValidAddress);
                    console.log("Total # buildings on origin street is " + totalBuildings);
                    console.log("address difference is " + averageAddressDifference);
                    testCounter++;
                    //console.log("search complete for " + streetname + " not originally in local database, now preparing next address");
                    prepareNextAddressSearch();
                }
            }  //grab next address in array and start over
            else
            {
                console.log("search complete for bbox");
            }
            
    } else
    {
        if (!searchReady)
        {
            console.log(streetname + " is in database");
            generateAddressField();
        } else if (!searchComplete)
        {
            validateAddressField();
        }
        else if(addressList > 0)
        {
            
             if(totalOriginBuildings === 0)
                {
                    console.log("# buildings is zero");
                    totalBuildings = totalOriginBuildings;
                    setTimeout(main, 100);
                }
                else if(totalOriginBuildings  > totalBuildings)
                {
                    totalBuildings = totalOriginBuildings;
                    buildingTimeCounter++;
                    console.log(totalOriginBuildings + " buildings have been found");
                    setTimeout(main,buildingTimeCounter * 1000);
                }
                else
                {
                    if(testCounter == 0)
                    {
                        averageAddressDifference = Math.ceil((largestValidAddress - smallestValidAddress)/totalOriginBuildings);
                    }
                    
                    console.log(largestValidAddress);
                    console.log(smallestValidAddress);
                    console.log("Total # buildings on origin street is " + totalBuildings);
                    console.log("address difference is " + averageAddressDifference);
                    testCounter++;
                    //console.log("search complete for " + streetname + " not originally in local database, now preparing next address");
                    prepareNextAddressSearch();
                }
        }
        else
        {
            alert("all addresses in bbox have been searched");
        }
        
    }
}


function validateFirstAddress()
{
    firstAddressSearchValidateAttempt = true;
    addressRangeService(document.getElementById('searchBox').value);
}


function prepareNextAddressSearch()
{
        homes = [];
        currentMin = 0;
        currentMax = 0;
        inLocalDB = false;
        DBChecked = false;
        firstValidAddressHit = false;
        rangeCalculated = false;
        searchReady = false;
        searchComplete = false;
        foundSmallestAddressNum = false;
        foundLargestAddressNum = false;
        lowRangeHitZero = false;
        firstAddressHitCount = 0;
        buildingTimeCounter = 0;
        consecutiveMisses;
        addressDiffMultiple;
        lowRangeSearches = 0;
        highRangeSearches = 0;
        streetname = arrayOfStreetnames[arrayOfStreetnames.length - 1]; //store new address to be searched for in variable
        addressWONums = streetname + ", " + cityname; //^^along with its components
        arrayOfStreetnames.pop();
        addressList = arrayOfStreetnames.length;
        main();
       
}


/**checks local database for existence of address
 * 
 * @returns {undefined}
 */
function getAddressRange()
{

    /**********************ADDRESS RETRIEVAL CODE ******************************/
    var addressData = new XMLHttpRequest();
    //will return php address results

    addressData.onload = function () {

        //This is where you handle what to do with the response.
        //The actual data is found on this.responseText
        DBResponse = this.responseText;
        DBChecked = true;
        if(DBResponse == "DNE")
        {
            inLocalDB = false;
            
        }
        else
        {
            inLocalDB = true;
        }
        
        
        main();
        
    }; //END ONLOAD



    /**********************ADDRESS DATA REQUEST CODE ****************************/

    var streetnamePlaceholder = "streetname=";
    var cityPlaceholder = "city=";

    var streetnameVariable;
    var cityVariable;


    var PageToSendTo = "checkAddress.php?";
    var url;
    
    
    
    streetnameVariable = streetname;
    cityVariable = cityname;
    url = PageToSendTo + streetnamePlaceholder + streetnameVariable + "&" + cityPlaceholder + cityVariable;


    addressData.open("GET", url, true);
    addressData.send();
    /**********************************************************************************/
}


/**
 * creates variables that hold complete address of new address to be searched
 * @returns {undefined}
 */
function getLocation()
{
    if(originAddress.indexOf(streetname) > -1 /*Run if address is the user-inputted address */)
    { 
        addressRangeService(originAddress);
    }
    else 
    { 
        
        if(consecutiveMisses === undefined)
        {
            consecutiveMisses = 0;
        }
        else
        {
            consecutiveMisses++;
        }
        
        
        
        
        if(lowRangeSearches <= maxAllowedSearches && !lowRangeHitZero/* decrease address until we get valid*/)
        { 
            if(consecutiveMisses == averageAddressDifference)
            {
                if(addressDiffMultiple === undefined)
                {
                    addressDiffMultiple = consecutiveMisses;
                    
                }
                else
                {
                    addressDiffMultiple = addressDiffMultiple * consecutiveMisses;
                }
                
                consecutiveMisses = 0;
                maxAllowedSearches = Math.ceil(maxAllowedSearches/addressDiffMultiple);
                addressNums -= averageAddressDifference * consecutiveMisses;
                 currentAddress = addressNums + " " + addressWONums;
                 setTimeout(addressRangeService(currentAddress),50);
            }
            else if(addressDiffMultiple === undefined)
            {
                addressNums -= averageAddressDifference; 
                currentAddress = addressNums + " " + addressWONums;
                setTimeout(addressRangeService(currentAddress),50);
            }
            else
            {
                addressNums -= averageAddressDifference * addressDiffMultiple;   
               currentAddress = addressNums + " " + addressWONums;
               setTimeout(addressRangeService(currentAddress),50);
            }
        }
        else if(lowRangeSearches <=  maxAllowedSearches && lowRangeHitZero /* resets address so to search high values as last resort; note, this should only be called once for each street *if we havent found any valid ranges yet*/)
        {
           console.log("resetting address to smallest valid address so to search only high range now");
           maxAllowedSearches = Math.pow(10, originAddressNums.length) + (maxAllowedSearches - lowRangeSearches);
           lowRangeSearches = maxAllowedSearches + 1;
           addressNums = smallestValidAddress + averageAddressDifference;
           currentAddress = addressNums + " " + addressWONums;
           consecutiveMisses = 0;
           addressDiffMultiple;
           setTimeout(addressRangeService(currentAddress),50);
        }  
        else if(lowRangeSearches > maxAllowedSearches && highRangeSearches <= maxAllowedSearches)
        {
            console.log("high range is still lower or equal to max searches allowed");
             if(consecutiveMisses == averageAddressDifference)
            {
            
                if(addressDiffMultiple === undefined)
                {
                    addressDiffMultiple = consecutiveMisses;
                }
                else
                {
                    addressDiffMultiple = addressDiffMultiple * consecutiveMisses;
                }
  
  
                consecutiveMisses = 0;
                maxAllowedSearches = Math.ceil(maxAllowedSearches/addressDiffMultiple);
                addressNums += averageAddressDifference * consecutiveMisses;
                currentAddress = addressNums + " " + addressWONums;
                
                
               
            }
            else if(addressDiffMultiple === undefined)
            {
               addressNums += averageAddressDifference; 
                currentAddress = addressNums + " " + addressWONums;
                setTimeout(addressRangeService(currentAddress),50);
            }
            else
            {
                addressNums += averageAddressDifference * addressDiffMultiple;   
               currentAddress = addressNums + " " + addressWONums;
               setTimeout(addressRangeService(currentAddress),50);
            }
            
        }
        else /*at this point, no valid address ranges could be found for given street address inputed by user */
        {
            alert("searched high and low but found no valid address range for given street");
            firstAddressSearch = true;
            bboxCalculated = false;
            haveSurroundingStreets = false;
            DBChecked = false;
            firstAddressSearchValidateAttempt = false;
            consecutiveMisses;
            addressDiffMultiple;
            lowRangeSearches = 0;
            highRangeSearches = 0;
            firstAddressHitCount = 0;
            buildingTimeCounter = 0;
            testCounter = 0;
            document.getElementById('searchBox').value = '';
            //search high and low within max range but found no valid address ranges for given street
        }
    }
}


/**
 * query request setup for US census geocoder
 * @param {type} currAddr
 * @returns {undefined}
 */
function addressRangeService(currAddr)
{

    if (currAddr === undefined)
    {
        main();
    } else
    {
        //set its source api to the JSONP API
        var USCensusSearch = "http://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=" + currAddr + "&benchmark=Public_AR_Current" + "&format=jsonp" + "&callback=addressRangeCallback";
        //create a new script element
        var censusReturn = document.createElement('script');
        //set its source api to the JSONP API
        censusReturn.type = 'text/javascript';
        censusReturn.src = USCensusSearch;
        //stick the script element in the page myMap
        document.getElementById('myMap').appendChild(censusReturn);
    }

}


/**
 * US Census geocoder callback functiont that will always jump back to main function 
 *
 * @param {type} json
 * @returns {undefined}
 */
function addressRangeCallback(json)
{

    if (json)
    {
        try {
            if (typeof json.result.addressMatches[0].matchedAddress !== 'undefined'/* current address being searched is valid address within valid range*/)
            {
                 firstValidAddressHit = true;
                //console.log("address is in US Census database");


                if (firstAddressSearch/* current address is one inputted by user*/)
                {
                    //firstAddressSearch = false;
                    originAddress = document.getElementById('searchBox').value;
                    originAddressNums = originAddress.substring(originAddress.indexOf(" ") + 1, originAddress.length);
                    addressNums = originAddress.substring(0, originAddress.indexOf(" "));
                    addressWONums = originAddress.substring(originAddress.indexOf(" ") + 1, originAddress.length);
                    originAddressWONums = addressWONums;
                    var addressComponentsWONums = addressWONums.split(',');
                    streetname = addressComponentsWONums[0].trim();
                    originStreetname = streetname;
                    cityname = addressComponentsWONums[1].trim();
                    maxAllowedSearches = Math.pow(10, addressNums.length);
                    firstAddressSearchValidateAttempResult = true;
                }

               


                censusData[0] = json.result.addressMatches[0].addressComponents.fromAddress;
                censusData[1] = json.result.addressMatches[0].addressComponents.toAddress;
                censusData[2] = json.result.addressMatches[0].addressComponents.streetName;
                censusData[3] = json.result.addressMatches[0].addressComponents.suffixType; //Rd, Ln, St, etc..
                censusData[4] = json.result.addressMatches[0].addressComponents.city;
                censusData[5] = json.result.addressMatches[0].addressComponents.state;
                streetnameSuffix = censusData[3];
                streetname = censusData[2] + " " + streetnameSuffix;
                cityname = censusData[4];
                statename = censusData[5];
                currentMin = Number(censusData[0]);
                currentMax = Number(censusData[1]);
                main();
            }
        } catch (e /*current address being searched is not in valid range for given street*/)
        {
            if (firstAddressSearch)
            {
                firstAddressSearch = true;  
                firstAddressSearchValidateAttempt = false;
                firstAddressSearchValidateAttempResult;
               alert("The address could not be found");
               document.getElementById('searchBox').value = '';
                
            } else if (firstValidAddressHit /*We have found, at least, one valid address for given street*/)
            {
                if(!foundSmallestAddressNum)
                {
                    foundSmallestAddressNum = true;
                    smallestValidAddress = currentMin + 1; //save smallest valid address for given street
                    addressNums = smallestValidAddress;
                    main();
                }
                else
                {
                    foundLargestAddressNum = true;
                     largestValidAddress = currentMax - 1; //save largest valid address for given street   
                    main();
                }
                
            }
            else if(addressNums < smallestValidAddress)
            {
                
                if(addressNums <= 0)
                {
                    lowRangeHitZero = true;
                }
                lowRangeSearches++;
                main();
            }
            else
            {
                highRangeSearches++;
                main();
            }
        }
    }
}



/* 1) finds smallest address range
 * 2) finds largest address range
 * 3)inserts new street data into database(since at this function call, it is assumed, via program execution sequence, that current street info is not in our DB)
 * @returns {undefined}
 */
function setAddressRange()
{

    if (!foundSmallestAddressNum)
    {
        console.log("Smallest valid address not found ");
        findSmallestAddress();
    } else if (!foundLargestAddressNum)
    {
        console.log("Largest valid address not found");
        findLargestAddress();
    } else
    {
        saveAddressToDB();
    }

}



function saveAddressToDB()
{
    /**********************NEW DATABASE DATA INSERTION RETRIEVAL CODE ******************************/
        var newData = new XMLHttpRequest();
        //will return php address results
        newData.onload = function () {
            //This is where you handle what to do with the response.
            //The actual data is found on this.responseText
            //alert("newData inserted");
            rangeCalculated = true;
            main();
        }; //END ONLOAD



        /**********************NEW DATABASE  DATA INSERTION REQUEST CODE ****************************/
        var lowAddressPlaceholder = "lowaddress=";
        var lowAddressVariable = smallestValidAddress;
        var highAddressPlaceholder = "highaddress=";
        var highAddressVariable = largestValidAddress;
        var streetnamePlaceholder = "streetname=";
        var streetnameVariable = streetname;
        var cityPlaceholder = "city=";
        var cityVariable = cityname;
        var statePlaceholder = "state=";
        var stateVariable = statename;
        var PageToSendTo = "insertNewAddress.php?";
        var url = PageToSendTo + lowAddressPlaceholder + lowAddressVariable + "&" + highAddressPlaceholder + highAddressVariable + "&" + streetnamePlaceholder + streetnameVariable + "&" + cityPlaceholder + cityVariable + "&" + statePlaceholder + stateVariable;

        newData.open("GET", url, true);
        newData.send();

        /**********************************************************************************/
}


/**
 * at this point, min has been validated or is zero, indicating that we are searching for street addresses other than original street AND newAdressNum is either undefined or smallestOriginalValidAddress
 * @returns {undefined}
 */
function findSmallestAddress()
{
    currentMin--;
    currentAddress = currentMin + " " + addressWONums;
    setTimeout(addressRangeService(currentAddress),150);
}

function findLargestAddress()
{
    currentMax++;
    currentAddress = currentMax + " " + addressWONums;
    setTimeout(addressRangeService(currentAddress),150);
    
}














//creates array with finalized address range for given street
function generateAddressField()
{
    
    if(inLocalDB)
    {
         //Prepare data from database for  address
        DBResponse = JSON.parse(DBResponse);
        smallestValidAddress = DBResponse.lowaddress;
        largestValidAddress = DBResponse.highaddress;
        streetname = DBResponse.streetname;
        streetnameSuffix = censusData[3];
        cityname = DBResponse.city;
        statename = DBResponse.state;
    }
    
    var low = smallestValidAddress;
    var high = largestValidAddress;

    var addr;
    while (low <= high)
    {
        addr = low + " " + addressWONums;
        homes.push(addr);
        low++;
    }
    searchReady = true;
    setTimeout(main(),100);
}

function validateAddressField()
{

    for (var x = 0; x < homes.length; x++)
    {
        query = homes[x];
        map.getCredentials(callSearchService);
    }

    searchComplete = true;
    setTimeout(main(),100);
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
        } else
        {
            
            var viewRect = Microsoft.Maps.LocationRect.fromEdges(northLatitude, westLongitude, southLatitude, eastLongitude);
            map.setView({bounds: viewRect});
            var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
            var pin = new Microsoft.Maps.Pushpin(location);
             if(originAddress.indexOf(currentAddress) == -1)
            {
                pinCollection.push(pin);
                totalOriginBuildings++;
            }
            
            
            Microsoft.Maps.Events.addHandler(pin, 'click', function () {
                showInfoBox(result);
            });
            
            
            map.entities.push(pin);


        }

    }
}


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

        haveSurroundingStreets = true;
        arrayOfStreetnames = this.responseText.split(',');
        addressList = arrayOfStreetnames.length;
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



function type(val) {
    return Object.prototype.toString.call(val).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
}