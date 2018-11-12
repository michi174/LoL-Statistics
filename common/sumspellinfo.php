<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-type:application/json");
    
    require_once("riotapi.php");

    $spellId = (isset($_GET['spellId']) ? $_GET['spellId'] : null);

    $riot = new RiotAPI;

    $file = json_decode(utf8_encode(file_get_contents("../static/data/sumspells.json")),true);

    if(isset($spellId))
    {
        echo json_encode($file["data"][$spellId]);
    }
    else
    {
        echo json_encode($file["data"]);
    }
?>