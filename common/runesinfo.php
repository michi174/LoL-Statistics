<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-type:application/json");
    
    require_once("riotapi.php");

    $filename = "runes.json";

    $id = (isset($_GET['runeid']) ? $_GET['runeid'] : null);
    $riot = new RiotAPI;
    $file = "../static/data/".$filename;
    $data = null;

    if(file_exists($file))
    {
        //$data = json_decode(utf8_encode(file_get_contents(".$file.")),true);
        $data = json_decode(utf8_encode(file_get_contents($file)),true);
    }
    else
    {
        die("runesfile ".$file." not found!");
    }
    

    if(isset($id))
    {
        echo json_encode($data["data"][$id]);
    }
    else
    {
        echo json_encode($data);
    }
?>