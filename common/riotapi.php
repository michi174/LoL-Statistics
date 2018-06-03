<?php
    class RiotAPI
    {

        const API_KEY = "RGAPI-61963597-82a1-41ac-9f0a-3e006fdc9deb"; //RIOT API Key hier eintragen.
        const API_URL = "api.riotgames.com/lol/";

        

        private $status_code    = 200;
        private $status_msg     = "";
        private $api_error      = "";

        private $api_response   = "";

        protected function buildApiUrl($api, $region, $param = "")
        {
            //Todo: Es müssen belibig viele Parameter übergeben werden können. Champions API kann sehr viele Paramenter annehmen.
            return "https://".$region.".".self::API_URL.$api.$param."?api_key=".self::API_KEY;
        }

        protected function executeApi($url)
        {
            $ch = curl_init($url);  

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $api_response = curl_exec($ch);
            $status = json_decode($api_response);

            if(isset($status->status->status_code))
            {
                $this->status_code = $status->status->status_code;
                $this->status_message = $status->status->message;
                $this->api_error = $url;
                
                if($this->status_code == 429)
                {
                    sleep(1);
                    $this->executeApi($url);
                }

            }
            else
            {
                $this->status_code = 200;
                $this->api_response = $api_response;
            }

            return $api_response;
        }

        protected function getApiData()
        {
            if($this->status_code == 200)
            {
                return $this->api_response;
            }
            else
            {
                return $this->status_code." on ".$this->api_error;
            }
        }

        public function getSummonerInfo($summoner, $region)
        {
            $api = "summoner/v3/summoners/by-name/";
            $url = $this->buildApiUrl($api, $region, $summoner);
            $this->executeApi($url);

            return $this->getApiData();
        }

        public function getSummonerRank($summonerId, $region)
        {
            $api = "league/v3/positions/by-summoner/";
            $url = $this->buildApiUrl($api, $region, $summonerId);
            $this->executeApi($url);

            return $this->getApiData();
        }

        public function getMatchList($accountId, $region)
        {
            $api = "match/v3/matchlists/by-account/";
            $url = $this->buildApiUrl($api, $region, $accountId);
            $this->executeApi($url);

            return $this->getApiData();
        }

        public function getChampionInfo($region, $params = null)
        {
            /*Todo: 
            Nur 10 API Request pro Stunde. Muss in JSON File gespeichert werden und nur bei Bedarf akktualisieren.*/
            $api="static-data/v3/champions/";
            $url = "https://euw1.api.riotgames.com/lol/static-data/v3/champions?locale=de_DE&dataById=true&api_key=".self::API_KEY;
            $this->executeApi($url);

            return $this->getApiData();
        }

        public function getMatchDetails($matchId, $region)
        {
            $api = "match/v3/matches/";
            $url = $this->buildApiUrl($api, $region, $matchId); 
            $this->executeApi($url);
            
            return $this->getApiData();
        }
    }
?>