<?php

namespace subcontroller\head;

use wsc\controller\Subcontroller_abstract;
use wsc\view\Html;
use wsc\view\renderer\Tpl;


/**
 *
 * @author Michi
 *        
 */
class head extends Subcontroller_abstract 
{
	public function runBeforeMain()
	{
		$view	= $this->createView(new Html());
		$view->setRenderer(new Tpl());
	}
}

?>