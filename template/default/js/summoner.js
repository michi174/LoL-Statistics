
const api_url = "http://michi-pc/steamclient/common/";
var champions = null;

var queues = new Array();
queues['RANKED_SOLO_5x5'] = "Solo/Duo Rangliste";

var tiers = new Array();
tiers["BRONZE"] = "Bronze";
tiers["SILVER"] = "Silber";
tiers["GOLD"] = "Gold";
tiers["PLATIN"] = "Platin";
tiers["DIAMOND"] = "Diamant";
tiers["MASTER"] = "Master";
tiers["CHALLENGER"] = "Challenger";

var ranks = new Array();
ranks['I'] = 1;
ranks['II'] = 2;
ranks['III'] = 3;
ranks['IV'] = 4;
ranks['V'] = 5;

var lanes = new Array();
lanes["BOTTOM"] = "Bot";
lanes["BOT"] = "Bot";
lanes["MID"] = "Mid";
lanes["TOP"] = "Top";
lanes["NONE"] = "Roam";
lanes["MIDDLE"] = "Mid";
lanes["JUNGLE"] = "Jungle";

var roles = new Array();
roles["DUO"] = "Duo";
roles["DUO_CARRY"] = "Carry";
roles["DUO_SUPPORT"] = "Support";
roles["SOLO"] = "Solo";
roles["NONE"] = "";


function getChampions()
{
  getChamps_req = new XMLHttpRequest();
  getChamps_req.open("GET", api_url+"championinfo.php", true);
  
  getChamps_req.onreadystatechange = function()
  {
    if(getChamps_req.readyState == 4)
    {
      try
      {
        champions = JSON.parse(getChamps_req.responseText);
      }
      catch(e)
      {
        console.log("error on getting champions from server");
        console.log(getChamps_req.responseText);
      }
    }
  }
  getChamps_req.send(null);
}

getChampions();

function getChmapionData(championId)
{
  return champions[championId];
}


function getSummon()
{

  document.getElementById("req-msg").innerHTML = "";
  document.getElementById("search-btn").classList.add("is-loading");

  var summoner = document.getElementById("sum-name-inp").value;
  var region = document.getElementById("sum-region").value;
  var error = false;
  var status = "";

  //Summoner Request Start
  var sum_req = new XMLHttpRequest();
  
  sum_req.open("GET", api_url+"summoner.php?summoner="+summoner+"&region="+region, true);
  
  sum_req.onreadystatechange = function()
  {
    if(sum_req.readyState == 4)
    {
      try
      {
        status = sum_req.responseText;
        var summoner = JSON.parse(sum_req.responseText);
        
        document.getElementById("sum-name").innerHTML = summoner.name;
        document.getElementById("sum-match-name").innerHTML = summoner.name;
        document.getElementById("sum-lvl").innerHTML = summoner.summonerLevel;
        document.getElementById("sum-id").innerHTML = summoner.id;
        document.getElementById("sum-search-result").style.display = 'block';
        document.getElementById("sum-pic").setAttribute('alt', summoner.profileIconId);
        document.getElementById("sum-pic").setAttribute('src', 'http://ddragon.leagueoflegends.com/cdn/8.8.2/img/profileicon/' + summoner.profileIconId + '.png');

        //Ranking Request Start
        var rank_req = new XMLHttpRequest();
        rank_req.open("GET", api_url+"summoner_rank.php?summonerid="+summoner.id+"&region="+region, true);

        rank_req.onreadystatechange = function()
        {
          if(rank_req.readyState == 4)
          {
            try
            {
              var rank = JSON.parse(rank_req.responseText);

              if(rank.length > 0)
              {
                document.getElementById("sum-tier").innerHTML = tiers[rank[0].tier]+" "+ranks[rank[0].rank];
                document.getElementById("sum-lp").innerHTML = rank[0].leaguePoints;
                document.getElementById("sum-queue").innerHTML = queues[rank[0].queueType];
                document.getElementById("sum-wins").innerHTML = "W-"+rank[0].wins;
                document.getElementById("sum-loss").innerHTML = "L-"+rank[0].losses;
              }
              else
              {
                document.getElementById("sum-rank").innerHTML = "";
              }
            }
            catch(e)
            {
              error = true;
            }
            addDevMsg(rank_req.responseText);
          }          
        }
        rank_req.send(null);
        //Rank Request End

        //Matches Request Start
        document.getElementById("sum-matches-container").innerHTML = `
        <tr>
          <td class="has-text-centered" colspan="4"><div class="control is-medium is-loading is-centered">
            <input class="input is-link has-text-centered is-medium" value="loading" readonly></div>
          </td>
        </tr>`;
        var match_req = new XMLHttpRequest();
        match_req.open("GET", api_url+"matchlistdetail.php?accountId="+summoner.accountId+"&region="+region, true);

        console.log("start loading matches...");

        match_req.onreadystatechange = function()
        {
          if(match_req.readyState == 4)
          {
            try
            {
              var matches = JSON.parse(match_req.responseText);
              var matches_length = matches.length;



              setTimeout(function()
              {
                if(matches_length > 0)
                {
                  var max_match_results = 30;
                  max_match_results = (matches_length<max_match_results) ? matches_length : max_match_results;

                  var matches_html = "";

                  for(var i = 0; i<max_match_results; i++)
                  {
                    var iswin = (matches[i].win == true) ? "is-win" : "is-loss";
                    matches_html = matches_html +`

                    <tr>
                      <td class="`+iswin+`" id="sum-match-champion-`+i+`">
                        <span><img class="image is-64x64" src="https://ddragon.leagueoflegends.com/cdn/8.9.1/img/champion/`+getChmapionData(matches[i].champion).name+`.png"></span>
                        <small><span>`+getChmapionData(matches[i].champion).name+` (`+matches[i].level+`)</span></small>
                      </td>
                      <td id="sum-match-queue-`+i+`"><small>`+matches[i].kills+`/`+matches[i].deaths+`/`+matches[i].assists+`</small></td>
                      <td id="sum-match-lane-`+i+`"><small>`+lanes[matches[i].lane]+` | `+roles[matches[i].role]+`</small></td>
                      <td id="sum-match-role-`+i+`"><small>`+matches[i].gold+` <br> `+matches[i].minions+`</small></td>
                      
                    </tr>`;
                    if(i==max_match_results-1)
                    {
                      document.getElementById("sum-matches-container").innerHTML = matches_html;
                    }

                  }
                }
                else
                {
                  console.log("no matches found");
                }
              },0);

            }
            catch(e)
            {
              //do some debugging here...
              console.log(e);
              console.log(match_req.responseText);
              error = true;
            }
            addDevMsg(match_req.responseText);
          }
        }
        match_req.send(null);
        console.log("matches loaded");
      }
      catch(e)
      {
        error = true;
      }
      addDevMsg(status);
    }
    else
    {
      //something to do while loading...
    }
    document.getElementById("search-btn").classList.remove("is-loading");

    if(error == true)
    {
      document.getElementById("req-state").classList.add("is-danger");
    }
    else
    {
      document.getElementById("req-state").classList.remove("is-danger");
      document.getElementById("req-state").classList.add("is-success");
    }
  }
  sum_req.send(null);
}

function addDevMsg(msg)
{
  document.getElementById("req-msg").innerHTML += msg+"<br><br>";
}
