<?php

namespace subcontroller\content_end;

use wsc\controller\Subcontroller_abstract;
use wsc\view\Html;
use wsc\view\renderer\Tpl;

/**
 *
 * @author Michi
 *        
 */
class content_end extends Subcontroller_abstract 
{
	public function runAfterMain()
	{
		$view	= $this->createView(new Html());
		$view->setRenderer(new Tpl());
	}
}

?>