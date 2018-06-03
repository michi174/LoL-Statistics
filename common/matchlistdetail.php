<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-type:application/json");
    
    require_once("riotapi.php");

    const MAX_MATCHES = 20;

    $region = (isset($_GET["region"])) ? $_GET["region"] : "euw1";
    $accountId = (isset($_GET["accountId"])) ? $_GET["accountId"] : 214108484;
    $api_url = "http://".$_SERVER['HTTP_HOST']."/steamclient/common/";

    $matches = json_decode(ApiRequest($api_url."matchlist.php?accountId=".$accountId."&region=".$region), true)["matches"];
    $champions = json_decode(ApiRequest($api_url."championinfo.php"), true);
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

    $urls = Array();


    foreach($matches as $id => $match_data)
    {
        $urls[$id] = $api_url."matchdetails.php?matchId=".$match_data["gameId"]."&region=".$region;

    }
    
    $matches_new = multiApiRequest($urls);
    
    
    foreach($matches as $matchid => $match_data)
    {
        $match_detailed_data = json_decode($matches_new[$matchid], true);

        /*DEBUG Info:
         * 
         * $match_detailed_json = utf8_encode(json_encode($match_detailed_data));
        echo $match_detailed_json;
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
            $duration = $match_detailed_data["gameDuration"];

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


        }
        
        if($matchid === MAX_MATCHES-1)
        {
            break;
        }
    }


    echo utf8_encode(json_encode($detailed_matches));
    
    function multiApiRequest($urls)
    {
        $curly = Array();
        $is_busy = null;
        $matches = Array();
        $mh = curl_multi_init();
        
        //Curl handles erzeugen
        foreach($urls as $id => $match_data)
        {
            $curly[$id] = curl_init();
            curl_setopt($curly[$id], CURLOPT_URL, $urls[$id]);
            curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, true);
            
            
            curl_multi_add_handle($mh, $curly[$id]);
            
            if($id === MAX_MATCHES-1)
            {
                break;
            }
            
        }
        
        //Ausf�hren
        do
        {
            $exec_response = curl_multi_exec($mh, $is_busy);
            
        } while($is_busy > 0);
        
        foreach($curly as $id => $handle)
        {
            $matches[$id] = curl_multi_getcontent($handle);
        }
        
        curl_multi_close($mh);
        
        return $matches;
        
    }
    
    
    
    
    function ApiRequest($url)
    {
        $ch = curl_init($url);
        $mh = curl_multi_init();
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $api_response = curl_exec($ch);
        curl_close($ch);
        
        return $api_response;
    }
?>