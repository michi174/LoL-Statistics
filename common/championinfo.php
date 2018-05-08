<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-type:application/json");
    
    require_once("riotapi.php");

    $championId = (isset($_GET['championId']) ? $_GET['championId'] : null);

    $riot = new RiotAPI;

    $champions_file = json_decode(utf8_encode(file_get_contents("../static/data/champions.json")),true);

    if(isset($championId))
    {
        echo json_encode($champions_file["data"][$championId]);
    }
    else
    {
        echo json_encode($champions_file["data"]);
    }

    

?>