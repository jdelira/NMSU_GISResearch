<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);


try {

    if (isset($_GET['southlat']) && isset($_GET['westlong']) && isset($_GET['northlat']) && isset($_GET['eastlong'])) {

        $southlat = $_GET['southlat'];
        $westlong = $_GET['westlong'];
        $northlat = $_GET['northlat'];
        $eastlong = $_GET['eastlong'];




        $query = "way($southlat, $westlong, $northlat, $eastlong);(._;>;);out body;";


        //Original query search 
        $node_xml = file_get_contents("http://overpass-api.de/api/interpreter?data=" . urlencode($query));

        $nodeVals = simplexml_load_string($node_xml);


        //GO through way array to get all street names
        //$nodeVals->way[i]->tag[2];
        //!(is_numeric($entry->tag[1]['v'] )



        $myArray = [];
        $index = 0;
        foreach ($nodeVals->{'way'} as $entry) {
            //checks if street name is in index 1 or 2 because there are some tags that provide street name in index 1 for some unknown reason
            //replace with following if statement if other is not better

            if ($entry->tag[1]['v'] == "residential" || $entry->tag[1]['v'] == "primary" || $entry->tag[1]['v'] == "secondary") {

                $streetnameVal1 = (string) $entry->tag[2]['v'];


                //disregards numbers as street names
                if (!is_numeric($streetnameVal1)) {
                    array_push($myArray, $streetnameVal1);
                }
            } else {
                $streetnameVal2 = (string) $entry->tag[1]['v'];

                //disregards numbers as street names
                if (!(is_numeric($streetnameVal2))) {
                    array_push($myArray, $streetnameVal2);
                }
            }
        }


        $myArray = implode(",", $myArray);
        echo $myArray;
    }
} catch (Exception $e) {
    echo "<br>" . $e->getMessage();
}
?>