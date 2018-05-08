<?php

namespace subcontroller\footer;

use wsc\controller\Subcontroller_abstract;
use wsc\view\Html;
use wsc\view\renderer\Tpl;

/**
 *
 * @author Michi
 *        
 */
class footer extends Subcontroller_abstract 
{
	public function runAfterMain()
	{
		//View des Footers erzeugen.
		$view	= $this->createView(new Html());
		$view->setRenderer(new Tpl());
	}
}

?>