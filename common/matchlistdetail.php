<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-type:application/json");
    
    require_once("riotapi.php");

    const MAX_MATCHES = 5;

    $region = (isset($_GET["region"])) ? $_GET["region"] : "euw1";
    $accountId = (isset($_GET["accountId"])) ? $_GET["accountId"] : 214108484;
    $api_url = "http://".$_SERVER['HTTP_HOST']."/steamclient/common/";

    $matches = json_decode(ApiRequest($api_url."matchlist.php?accountId=".$accountId."&region=".$region), true)["matches"];
    $champions = json_decode(ApiRequest($api_url."championinfo.php"), true);
    $player_data = null;

    $detailed_matches = Array();
    $win = false;
    $kills = 0;
    $deaths = 0;
    $assists = 0;
    $gold = 0;
    $minions = 0;
    $level = 1;


    foreach($matches as $matchid => $match_data)
    {
        $match_detailed_data = json_decode(ApiRequest($api_url."matchdetails.php?matchId=".$match_data["gameId"]."&region=".$region), true);

        //$match_detailed_json = utf8_encode(json_encode($match_detailed_data)); //echo for debugging
        //echo $match_detailed_json;

        $players = $match_detailed_data["participantIdentities"];
        $players_match_data = $match_detailed_data["participants"];
        $searched_playerId = null;

        foreach($players as $playerId => $playerData)
        {
            $searched_playerId = $playerId;

            if($playerData["player"]["accountId"] == $accountId)
            {
                break;
            }
        }

        $win = $players_match_data[$searched_playerId]["stats"]["win"];
        $kills = $players_match_data[$searched_playerId]["stats"]["kills"];
        $deaths = $players_match_data[$searched_playerId]["stats"]["deaths"];
        $assists = $players_match_data[$searched_playerId]["stats"]["assists"];
        $gold = $players_match_data[$searched_playerId]["stats"]["goldEarned"];
        $minions = $players_match_data[$searched_playerId]["stats"]["totalMinionsKilled"];
        $level  = $players_match_data[$searched_playerId]["stats"]["champLevel"];


        $detailed_matches[$matchid] = $match_data;
        $detailed_matches[$matchid]["championName"] = $champions[$match_data["champion"]]["name"];
        $detailed_matches[$matchid]["win"] = $win;
        $detailed_matches[$matchid]["kills"] = $kills;
        $detailed_matches[$matchid]["assists"] = $assists;
        $detailed_matches[$matchid]["deaths"] = $deaths;
        $detailed_matches[$matchid]["gold"] = $gold;
        $detailed_matches[$matchid]["minions"] = $minions;
        $detailed_matches[$matchid]["level"] = $level;

        if($matchid === MAX_MATCHES-1)
        {
            break;
        }
    }

    

    function ApiRequest($url)
    {
        $ch = curl_init($url);  

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $api_response = curl_exec($ch);
        curl_close($ch);
        
        //$status = json_decode($api_response);
    
        if(isset($status->status->status_code))
        {
            //echo "error";
        }
        else
        {
            //var_dump($api_response);
        }

        return $api_response;
    }

    echo utf8_encode(json_encode($detailed_matches));
?>