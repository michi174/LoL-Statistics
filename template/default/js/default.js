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

