<?php

namespace subcontroller\content_start;

use wsc\controller\Subcontroller_abstract;
use wsc\view\Html;
use wsc\view\renderer\Tpl;

/**
 *
 * @author Michi
 *        
 */
class content_start extends Subcontroller_abstract 
{
	public function runBeforeMain()
	{
		$view	= $this->createView(new Html());
		$view->setRenderer(new Tpl());
	}
}

?>