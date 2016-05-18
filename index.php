<!DOCTYPE html>
<html>
   <head>
      <title>Find a location by query</title>
      
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      <script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
      <script type="text/javascript" src="test.js"></script>
      <script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
   </head>
   <body onload="getMap();">
      <div id='myMap' style="position:relative; width:400px; height:400px;"></div>
      <div>
          <form role='form'>
              <input type='text' class='form-control' id='searchBox'>
          </form>
         <input type="button" value="Find location" onclick="main();" />
      </div>
      <div id="output"></div>
   </body>
</html>

<?php

