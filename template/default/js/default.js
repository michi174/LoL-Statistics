function toggleDevConsole()
{
    if(document.getElementById("req-state").style.display == "none")
    {
        document.getElementById("req-state").style.display = "block";
        document.getElementById("console-status").innerHTML = "Hide";
    }
    else
    {
        document.getElementById("req-state").style.display = "none";
        document.getElementById("console-status").innerHTML = "Show";
    }
}

function addDevMsg(msg)
{
  document.getElementById("req-msg").innerHTML += msg+"<br><br>";
}

//var templates = $('[data-template]');

//for (let domElement of templates) {

//    console.log($(domElement).attr('data-template'));
    
//    let template = "template/default/templates/" + $(domElement).attr('data-template') + ".html";

//    $.get(template, function (data) {
//        $("[data-template='" + $(domElement).attr('data-template') + "']").html(data);
//    });
//}
