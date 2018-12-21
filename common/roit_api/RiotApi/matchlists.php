<?php
namespace RiotApi;

class matchlists extends baseAPI
{
    
    protected $API_NAMESPACE = "match";
    
    protected $queryTypes = array(
        "by-account" => array(
            "name" => "by-account", 
            "queryname" => "account"
        )
    );
    
    //https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/BCmMd2wCNb-kG2iIimmUZEWKNUN3SHqzx9fl_zVIbszPqDM

    public function __construct(RiotAPI $api)
    {
        parent::__construct($api);
    }

    public function getApiUrl() :string
    {
        return $this->buildApiUrl();
    }
    
    private function buildApiUrl()
    {
        if(isset($this->queryType))
        {
            return "https://".$this->region["platform"]
            .".".$this->apiUrl."/".$this->API_NAMESPACE
            ."/".$this->apiVersion
            ."/".strtolower(substr(strrchr(__CLASS__, "\\"), 1))
            ."/".$this->queryTypes[$this->queryType]["name"]
            ."/".$this->getQueryNameString();
        }
        else
        {
            die("Error: No queryType set in given URL! ".$_SERVER['PHP_SELF']."?".$_SERVER['QUERY_STRING'].debug_print_backtrace());
        }
    }
}

