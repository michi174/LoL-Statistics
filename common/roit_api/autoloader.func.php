<?php
function __autoload($klasse)
{
    $include	= $_SERVER["DOCUMENT_ROOT"]."/steamclient/common/roit_api/".str_replace("\\", "/", strtolower($klasse)).".php";
	
	if(file_exists($include))
	{
		include_once $include;
	}
	else 
	{
		die("<br /><br />Fehler: Die Datei <br /><strong>" . $include . " </strong><br /> konnte nicht eingebunden werden, da die Datei nicht gefunden wurde.");
	}
}

?>