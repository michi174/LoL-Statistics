
const api_url = "http://michi-pc/steamclient/common/";
var champions = null;
var sumspells = null;

loadSumSpells();
loadChampions();

function getChmapionData(championId)
{
  return champions[championId];
}

function getSumSpellData(spellId)
{
  return sumspells[spellId];
}

function loadChampions()
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
        addDevMsg("Champions geladen");
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

function loadSumSpells()
{
  getSumsp_req = new XMLHttpRequest();
  getSumsp_req.open("GET", api_url+"sumspellinfo.php", true);

  getSumsp_req.onreadystatechange = function()
  {
    if(getSumsp_req.readyState == 4)
    {
      try
      {
        sumspells = JSON.parse(getSumsp_req.responseText);
        addDevMsg("Spells geladen");
      }
      catch(e)
      {
        console.log("error on getting champions from server");
        console.log(getSumsp_req.responseText);
      }
    }
  }
  getSumsp_req.send(null);
}

function getSummon()
{
  document.getElementById("search-btn").classList.add("is-loading");

  var summoner = document.getElementById("sum-name-inp").value.replace(/ /g, '');
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
              console.log(e);
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
                  var max_match_results = 100;
                  max_match_results = (matches_length<max_match_results) ? matches_length : max_match_results;

                  var matches_html = "";

                  for(var i = 0; i<max_match_results; i++)
                  {
                    var iswin = (matches[i].win == true) ? "is-win" : "is-loss";
                    var m_date = new Date(matches[i].timestamp);

                    var c_kda;

                    if(matches[i].deaths != 0)
                    {
                      c_kda = ((matches[i].kills+matches[i].assists)/matches[i].deaths).toFixed(2);
                    }
                    else
                    {
                      c_kda = "Perfect";
                    }
                    
                    matches_html = matches_html+`

                    <div class="content"><small>
                    <div class="columns is-mobile is-variable is-0 is-centered champion-info `+iswin+`">
                      <div class="column has-vcentered-content">
                        <div>`+queue_types[matches[i].queue]+`</div>
                        <div>`+m_date.toLocaleDateString()+`</div>
                        <div><strong>`+gameresults[matches[i].win]+`</strong></div>
                        <div>`+(matches[i].gameDuration/60).toFixed(0)+` min</div>
                      </div>
                      <div class="column has-vcentered-content c-sum-icons is-narrow">
                        <div class="c-pic-con">
                            <img class="image is-circle is-64x64" src="https://ddragon.leagueoflegends.com/cdn/8.11.1/img/champion/`+getChmapionData(matches[i].champion).image.full+`">
                        </div>
                        <div class="c-sum-spell-con">
                          <div class="c-sum-spell-1">
                              <img class="image is-30x30" src="https://ddragon.leagueoflegends.com/cdn/8.11.1/img/spell/`+getSumSpellData(matches[i].spell1Id).image.full+`">
                          </div>
                          <div class="c-sum-spell-2">
                              <img class="image is-30x30" src="https://ddragon.leagueoflegends.com/cdn/8.11.1/img/spell/`+getSumSpellData(matches[i].spell2Id).image.full+`">
                          </div>
                        </div>
                        <div class="c-sum-rune-con">
                          <div class="c-sum-rune-1">
                            <img class="image is-30x30 is-circle" src="https://bulma.io/images/placeholders/128x128.png">
                          </div>
                          <div class="c-sum-rune-2">
                              <img class="image is-30x30 is-circle" src="https://bulma.io/images/placeholders/128x128.png">
                          </div>
                        </div>
                      </div>
                      <div class="column has-vcentered-content c-kda-con">
                        <div><strong><span>`+matches[i].kills+`</span>/<span>`+matches[i].deaths+`</span>/<span>`+matches[i].assists+`</span></strong></div>
                        <div>`+c_kda+`</div>
                      </div>
                      <div class="column has-vcentered-content">
                        <div><span>`+getChmapionData(matches[i].champion).name+`</span> (<span>`+matches[i].level+`</span>)</div>
                        <div>`+matches[i].minions+`</div>
                        <div>`+matches[i].gold+`</div>
                        <div>{M_KP}</div> 
                      </div>
                      
                    </div>
                    </small>
                  </div>`;


                    if(i==max_match_results-1)
                    {
                      //document.getElementById("sum-matches-container").innerHTML = matches_html;
                    }
              
                  }
                  document.getElementById("sum-matches-container").innerHTML = matches_html;
                  console.log(matches_length+" matches loaded.");
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
      }
      catch(e)
      {
        error = true;
        console.log(e);
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
