<?php

  if(isset($_GET['southlat']) && isset($_GET['westlong']) && isset($_GET['northlat']) && isset($_GET['eastlong']))
  {
            
            $southlat = $_GET['southlat'];
            $westlong = $_GET['westlong'];
            $northlat = $_GET['northlat'];
            $eastlong = $_GET['eastlong'];
            
            
            
            //Original query without json specified

            $query= "way($southlat, $westlong, $northlat, $eastlong);(._;>;);out body;";
            
           //$query= "way(33.600801,-117.663165,33.605966,-117.660896);(._;>;);out body;";

            //Original query search 
            $node_xml = file_get_contents("http://overpass-api.de/api/interpreter?data=" . urlencode($query));
            
            $nodeVals = simplexml_load_string($node_xml);
            
            
            //GO through way array to get all street names
            //$nodeVals->way[i]->tag[2];
            
            $myArray = [];
            $index = 0;
            foreach ($nodeVals->{'way'} as $entry)
            {  
                //checks if street name is in index 1 or 2 because there are some tags that provide street name in index 1 for some unknown reason
                if($entry->tag[1]['v'] == "residential" || $entry->tag[1]['v'] == "primary" || $entry->tag[1]['v'] == "secondary")
                {
                    array_push($myArray,$entry->tag[2]['v']);     
                }
                else
                {
                    array_push($myArray,$entry->tag[1]['v']);
                }
                       
            }
            
            
            $myArray = implode(",", $myArray);
            echo $myArray;
            
  }