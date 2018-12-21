<?php
namespace RiotApi;

use RiotApi\IRiotApis;
use RiotApi\RiotAPI;

abstract class baseAPI implements IRiotApis
{
    
    protected $API_NAMESPACE;
    protected $queryTypes;
    protected $region;
    protected $apiVersion = "v4";
    protected $apiUrl;
    protected $queryType = null;
    protected $queryString = null;
    protected $params;

    public function __construct(RiotAPI $api)
    {
        $this->params = $api->params;
        $this->region = $api->getRegion();
        $this->apiUrl = $api::API_URL;
        $this->apiVersion = $api::API_VERSION;
        $this->setParam2Property("queryType", "queryType");
    }
    
    private function setParam2Property($param, $prop)
    {
        if(isset($this->params[$param]))
        {
            $this->{$prop} = $this->params[$param];
        }
    }
    
    protected function not2SeperatorHelper($not, $value)
    {
        if($value !== $not)
        {
            return "/";
        }
        else
        {
            return "";
        }
    }
    
    protected function getQueryNameString()
    {
        if(isset($this->params[$this->queryTypes[$this->queryType]["queryname"]]))
            return $this->params[$this->queryTypes[$this->queryType]["queryname"]];
            else
            {
                return "";
            }
    }
    
    abstract public function getApiUrl() : string;   
}

