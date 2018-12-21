<?php
use RiotApi\RiotAPI;

header("Access-Control-Allow-Origin: *");
header("Content-type:application/json");

require 'riotApi.php';

$link = "http://michi-pc/steamclient/common/roit_api/?name=Rázôr&region=euw&lang=de_AT&api=summoners&queryType=by-name";

$queryString = $_SERVER['QUERY_STRING'];


$api = new RiotAPI($queryString);
$url = $api->execute();

echo $api->getJSONFromURL($url);

//echo $api->getJSONFromURL("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/62745467?api_key=RGAPI-61963597-82a1-41ac-9f0a-3e006fdc9deb");

$api->debugInfo();

?>
