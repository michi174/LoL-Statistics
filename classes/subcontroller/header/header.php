<?php

namespace subcontroller\header;

use wsc\controller\Subcontroller_abstract;
use wsc\application\Application;
use wsc\pluginmanager\PluginManager;
use wsc\view\Html;
use wsc\view\renderer\Tpl;

/**
 *
 * @author Michi
 *        
 */
class header extends Subcontroller_abstract 
{
	private $application;
	
	public function __construct()
	{
		$this->application = Application::getInstance();
	}
	private function build()
	{

	}
	public function runBeforeMain()
	{
		$auth		= $this->application->load("Auth");
		$plugins	= PluginManager::getPlugins(false);
		
		$user		= $auth->getUser();
		$acl		= $this->application->load("Acl");
		
		$view	= $this->createView(new Html);
		$view->setRenderer(new Tpl());
		
		$view->renderer->assignVar("LOGGED_IN", $auth->isLoggedIn());
		$view->renderer->assignVar("FIRSTNAME", $user->data['firstname']);
		$view->renderer->assignVar("BACKEND_VIEW", $acl->hasPermission($user, "admin", "view"));
		$view->renderer->assignVar("PLUGINS", $plugins);		
	}
}

?>