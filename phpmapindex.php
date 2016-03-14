<!DOCTYPE html>
<html>
   <head>
      <title>Find a location by query</title>
      
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
      <script type="text/javascript" src="phpmaptest.js">
      </script>
   </head>
   <body onload="getMap();">
      <div id='myMap' style="position:relative; width:400px; height:400px;"></div>
      <div>
          <form role='form'>
              <input type='text' class='form-control' id='searchBox'>
          </form>
         <input type="button" value="FindLocation" onclick="findLocation();" />
      </div>
      <div id="output"></div>
   </body>
</html>

<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */