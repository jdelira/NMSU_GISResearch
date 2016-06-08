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
			
			while($index < 10)
			{
				if($entry->tag[$index]['k'] == "tiger:name_base")
				{
					
					if($entry->tag[$index+1]['k'] == "tiger:name_type")
					{
						$streetname = strval($entry->tag[$index]['v'] . " " . $entry->tag[$index+1]['v']);
					}
					else
					{
						$streetname = strval($entry->tag[$index]['v']);
					}

					
		
					if(!(in_array($streetname, $myArray)))
					{
						array_push($myArray, $streetname);
					}
					
					break;
				}
				$index++;
			}
			$index = 0;
		
			
        }


        $myArray = implode(",", $myArray);
		
        echo $myArray;
    }
} catch (Exception $e) {
    echo "<br>" . $e->getMessage();
}
?>