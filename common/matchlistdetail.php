<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-type:application/json");
    
    require_once("riotapi.php");
    require_once 'roit_api/riotApi.php';

    const MAX_MATCHES = 10;
    
    $api = new RiotApi\RiotAPI();  

    $region = (isset($_GET["region"])) ? $_GET["region"] : "euw1";
    $accountId = (isset($_GET["accountId"])) ? $_GET["accountId"] : 214108484;
    $api_url = "http://".$_SERVER['HTTP_HOST']."/steamclient/common/";
    
    //$test   = ;
    //die(var_dump($test));

    $matches = json_decode($api->getJSONFromURL($api_url."roit_api/index.php?api=matchlists&queryType=by-account&account=".$accountId."&region=".$region), true)["matches"];
    
    $champions = json_decode($api->getJSONFromURL($api_url."championinfo.php"), true);
    $player_data = null;

    $detailed_matches = Array();
    $match_detailed_data = Array();
    $win = false;
    $kills = 0;
    $deaths = 0;
    $assists = 0;
    $gold = 0;
    $minions = 0;
    $level = 1;
    $duration = 0;
    $sumspell1 = 0;
    $sumspell2 = 0;
    $perkPrimary = 0;
    $perkSecondary = 0;
    $teamId = 0;
    $teamkills = 0;
    $killParticipation = 0;

    $urls = Array();


    foreach($matches as $id => $match_data)
    {
        $urls[$id] = $api_url."matchdetails.php?matchId=".$match_data["gameId"]."&region=".$region;

    }
    
    
    $matches_new = $api->getResult($urls);

    foreach($matches as $matchid => $match_data)
    {
        $match_detailed_data = json_decode($matches_new[$matchid]["body"], true);

        /*DEBUG Info:
         * 
         * $match_detailed_json = utf8_encode(json_encode($match_detailed_data));
         * echo $match_detailed_json;
         */

        if(is_array($match_detailed_data))
        {
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
            $minions = ($players_match_data[$searched_playerId]["stats"]["totalMinionsKilled"]+$players_match_data[$searched_playerId]["stats"]["neutralMinionsKilled"]);
            $level  = $players_match_data[$searched_playerId]["stats"]["champLevel"];
            $sumspell1  = $players_match_data[$searched_playerId]["spell1Id"];
            $sumspell2  = $players_match_data[$searched_playerId]["spell2Id"];
            $perkPrimary = $players_match_data[$searched_playerId]["stats"]["perk0"];
            $perkSecondary = $players_match_data[$searched_playerId]["stats"]["perkSubStyle"];
            $duration = $match_detailed_data["gameDuration"];
            $teamId = $players_match_data[$searched_playerId]["teamId"];

            $teamkills = 0;

            foreach($match_detailed_data["participants"] as $participant => $participant_data)
            {
                if($participant_data["teamId"] == $teamId)
                {
                    $teamkills += $participant_data["stats"]["kills"];
                }
            }
            $killParticipation = ($teamkills > 0) ? round(($kills+$assists) * 100 / $teamkills) : 0;

            $detailed_matches[$matchid] = $match_data;
            $detailed_matches[$matchid]["championName"] = $champions[$match_data["champion"]]["name"];
            $detailed_matches[$matchid]["win"] = $win;
            $detailed_matches[$matchid]["kills"] = $kills;
            $detailed_matches[$matchid]["assists"] = $assists;
            $detailed_matches[$matchid]["deaths"] = $deaths;
            $detailed_matches[$matchid]["gold"] = $gold;
            $detailed_matches[$matchid]["minions"] = $minions;
            $detailed_matches[$matchid]["level"] = $level;
            $detailed_matches[$matchid]["gameDuration"] = $duration;
            $detailed_matches[$matchid]["spell1Id"] = $sumspell1;
            $detailed_matches[$matchid]["spell2Id"] = $sumspell2;
            $detailed_matches[$matchid]["perkPrimaryStyle"] = $perkPrimary;
            $detailed_matches[$matchid]["perkSubStyle"] = $perkSecondary;
            $detailed_matches[$matchid]["teamkills"] = $teamkills;
            $detailed_matches[$matchid]["killParticipation"] = $killParticipation;




        }
        
        if($matchid === count($matches_new)-1)
        {
            break;
        }
    }

    echo utf8_encode(json_encode($detailed_matches));
?>