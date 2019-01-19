const api_url = "http://michi-pc/steamclient/common/";
var champions = null;
var sumspells = null;
var runes = null;
var matches = null;
var version = null;

loadVersion();




function loadVersion() {

    getVersion_req = new XMLHttpRequest();
    getVersion_req.open("GET", api_url + "/roit_api/versions.php", true);

    getVersion_req.onreadystatechange = function () {
        if (getVersion_req.readyState === 4) {
            try {
                version = JSON.parse(getVersion_req.responseText)[0];
                addDevMsg("Version geladen (" + version + ")");

                loadChampions();
                loadSumSpells();
                loadRunes();
            }
            catch (e) {
                console.log("error on getting version from server");
                console.log(getVersion_req.responseText);
            }
        }
    }
    getVersion_req.send(null);
}

function loadChampions() {
    getChamps_req = new XMLHttpRequest();
    getChamps_req.open("GET", api_url + "/roit_api/ddragon.php?api=cdn&version=" + version + "&locale=de_DE&request=champion", true);

    getChamps_req.onreadystatechange = function () {
        if (getChamps_req.readyState === 4) {
            try {
                champions = JSON.parse(getChamps_req.responseText);
                addDevMsg("Champions geladen");
            }
            catch (e) {
                console.log("error on getting champions from server");
                console.log(getChamps_req.responseText);
            }
        }
    }
    getChamps_req.send(null);
}

function loadSumSpells() {
    getSumsp_req = new XMLHttpRequest();
    getSumsp_req.open("GET", api_url + "/roit_api/ddragon.php?api=cdn&version=" + version + "&locale=de_DE&request=summoner", true);

    getSumsp_req.onreadystatechange = function () {
        if (getSumsp_req.readyState === 4) {
            try {
                sumspells = JSON.parse(getSumsp_req.responseText);
                addDevMsg("Spells geladen");
            }
            catch (e) {
                console.log("error on getting Summoner Spells from server");
                console.log(getSumsp_req.responseText);
            }
        }
    }
    getSumsp_req.send(null);
}

function loadRunes() {
    getRunes_req = new XMLHttpRequest();
    getRunes_req.open("GET", api_url + "/roit_api/ddragon.php?api=cdn&version=" + version + "&locale=de_DE&request=runesReforged", true);

    getRunes_req.onreadystatechange = function () {

        if (getRunes_req.readyState === 4) {
            try {
                runes = JSON.parse(getRunes_req.responseText);
                addDevMsg("Runes geladen");
                //getRuneReforged(8100);
                //getRuneReforged(8351);
            }
            catch (e) {
                console.log("error on getting Runes from server");
                console.log(e);
                console.log(getRunes_req.responseText);
            }
        }
    }
    getRunes_req.send(null);
}

function getChampionData(championId) {
    for (let champion in champions.data) {
        if (parseInt(champions.data[champion].key) === championId) {
            return champions.data[champion];
        }
    }
}

function getSumSpellData(spellId) {
    for (let spell in sumspells.data) {
        if (parseInt(sumspells.data[spell].key) === spellId) {
            return sumspells.data[spell];
        }
    }
    return sumspells[spellId];
}

function getSumRune(runeId) {
    for (var i = 0; i < runes.length; i++) {
        if (runes[i].id === runeId) {
            return runes[i];
        }
    }
}

function getRuneReforged(runeId) {
    let found = false;

    let haystack = runes;

    runeId = parseInt(runeId);

    for (let tree in haystack) {
        if (parseInt(haystack[tree].id) === runeId) {
            //console.log(haystack[tree]);
            //console.log("");
            return haystack[tree];
        }
        else {
            //console.log("not found in 1st lvl at "+haystack[tree].key+" tree");
            //console.log(" looking in slots...");
            for (let slot in haystack[tree].slots) {
                //console.log("  Slot:"+slot);
                for (let rune in haystack[tree].slots[slot].runes) {
                    //console.log("   "+rune);
                    if (parseInt(haystack[tree].slots[slot].runes[rune].id) === runeId) {
                        //console.log(haystack[tree].slots[slot].runes[rune]);
                        return haystack[tree].slots[slot].runes[rune];
                    }
                    else {
                        //console.log("Rune "+runeId+" not found!");
                    }
                }
            }
        }
    }
    console.log("Rune " + runeId + " not found!");
}

function getItemImage(itemId) {
    if (itemId !== 0) {
        return "https://ddragon.leagueoflegends.com/cdn/" + version + "/img/item/" + itemId + ".png";
    }
    else {
        return "template/default/gfx/item-placeholder.png";
    }
}

function getparticipantData(matchID, participantID) {

    var stats;
    var userdata;
    let html = "";

    let participants = matches[matchID].raw.participants;
    let userdatas = matches[matchID].raw.participantIdentities;

    let sPersonal = {
        cHeaderTitle: "Champion",
        cBodyVisability: "block",
        champLevel: "Level",
        kills: "Kills",
        deaths: "Tode",
        assists: "Assists",
        largestKillingSpree: "Killing Spree",
        largestMultiKill: "Multi Kill",
        longestTimeSpentLiving: "Längste Zeit am Leben"
    };

    let sFarm = {
        cHeaderTitle: "Farm",
        cBodyVisability: "none",
        totalMinionsKilled: "Vasallen getötet",
        neutralMinionsKilled: "Monster getötet",
        neutralMinionsKilledTeamJungle: "Monster getötet im eigenen Jgl",
        neutralMinionsKilledEnemyJungle: "Monster getötet im gegn. Jgl",
        goldEarned: "Gold",
        goldSpent: "Gold ausgegeben",
    };

    let sDamage = {
        cHeaderTitle: "Schaden",
        cBodyVisability: "block",
        totalDamageDealt: "Schaden (gesamt)",
        totalDamageDealtToChampions: "Schaden an Champions",
        magicDamageDealtToChampions: "Mag. Schaden an Champions",
        physicalDamageDealtToChampions: "Pys. Schaden an Champions",
        trueDamageDealtToChampions: "Abs. Schaden an Champions",
        largestCriticalStrike: "Max. kritischer Treffer",
        damageDealtToObjectives: "Schaden an Objekte",
        damageDealtToTurrets: "Schaden an Türme"

    };

    let sDefense = {
        cHeaderTitle: "Defensiv",
        cBodyVisability: "none",
        totalHeal: "Geheilter Schaden",
        damageSelfMitigated: "Verhinderter Schaden",
        totalDamageTaken: "Erlittener Schaden",
        magicalDamageTaken: "Erlittener mag. Schaden",
        physicalDamageTaken: "Erlittener phy. Schaden",
        trueDamageTaken: "Erlittener abs. Schaden"
    };

    let sVision = {
        cHeaderTitle: "Teamplay",
        cBodyVisability: "none",
        visionScore: "Sichtwertung",
        wardsPlaced: "Platzierte Wards",
        wardsKilled: "Zerstörte Wards",
        visionWardsBoughtInGame: "Pink Wards",
        timeCCingOthers: "CC Zeit (Champions)",
        totalTimeCrowdControlDealt: "CC (alle)"
    };

    let sObjectives = {
        cHeaderTitle: "Objekte",
        cBodyVisability: "none",
        turretKills: "Türme zerstört",
        inhibitorKills: "Inhibitoren zerstört",
        firstTowerKill: "Ersten Turm zerstört",
        firstTowerAssist: "Erster Turm Assist",
        firstInhibitorKill: "Ersten Inhibitor zerstört",
        firstInhibitorAssist: "Erster Inhibitor Assist",
    };

    for (participant in participants) {

        if (participants[participant].participantId == participantID) {
            stats = participants[participant].stats;

            break;
        }
    }

    for (udata in userdatas) {
        if (userdatas[udata].participantId == participantID) {
            userdata = userdatas[udata].player;
            break;
        }
    }
    let winbg = (matches[matchID].raw.participants[(matches[matchID].partId - 1)].stats.win === true) ? "win-bg" : "loss-bg";

    function drawSections(data) {
        let htmldata = "";

        let icon = (data.cBodyVisability === "none") ? "fa-angle-down" : "fa-angle-up";

        htmldata = htmldata + `
        <div class="c-table-header">
            <div class="data-clickable-header default-bg">
                <span class="icon is-small is-left"><i class="fas `+ icon + `"></i></span>&nbsp;` + data.cHeaderTitle + `
            </div>
            <div class="data-container" style="display: `+ data.cBodyVisability + `">`;
        for (let pName in data) {
            if (pName !== "cHeaderTitle" && pName !== "cBodyVisability") {
                htmldata = htmldata + `
                <div class="c-table-row columns is-mobile">
                    <div class="c-table-col column is-0">`+ data[pName] + `</div>
                    <div class="c-table-col column is-narrow">`+ stats[pName] + `</div>
                </div>`;
            }
        }
        htmldata = htmldata + `
            </div>
        </div>`;
        return htmldata;
    }

    html = html + `
        <div>
            <div class="htmldata" style="margin-top:1.5rem">
                <div class="c-table-row columns is-center is-variable is-mobile">
                    <div class="c-table-col column is-12 has-text-centered">`+ userdata.summonerName + `</div>
                </div>
            </div>
        </div>
        `+ drawSections(sPersonal) + `
        `+ drawSections(sDamage) + `
        `+ drawSections(sFarm) + `
        `+ drawSections(sDefense) + `
        `+ drawSections(sVision) + `
        `+ drawSections(sObjectives);
    return html;
}

function rotateIcon(JQueryItem) {
    if (!JQueryItem.hasClass("rotate-180")) {
        JQueryItem.addClass("rotate-180");
    }
    else {
        JQueryItem.removeClass("rotate-180");
        JQueryItem.addClass("rotate-360");

        setTimeout(function () {
            JQueryItem.removeClass("rotate-360");
        }, 500);


    }
}

function getSummon() {
    document.getElementById("search-btn").classList.add("is-loading");

    var summoner = document.getElementById("sum-name-inp").value.replace(/ /g, '');
    var region = document.getElementById("sum-region").value;
    var error = false;
    var status = "";

    //Summoner Request Start
    var sum_req = new XMLHttpRequest();

    //sum_req.open("GET", api_url+"summoner.php?summoner="+summoner+"&region="+region, true);
    sum_req.open("GET", api_url + "/roit_api/index.php?api=summoners&method=by-name&name=" + summoner + "&region=" + region, true);

    sum_req.onreadystatechange = function () {
        if (sum_req.readyState === 4) {
            try {
                status = sum_req.responseText;
                var summoner = JSON.parse(sum_req.responseText);

                document.getElementById("sum-name").innerHTML = summoner.name;
                document.getElementById("sum-lvl").innerHTML = summoner.summonerLevel;
                document.getElementById("sum-search-result").style.display = 'block';
                document.getElementById("sum-pic").setAttribute('alt', summoner.profileIconId);
                document.getElementById("sum-pic").setAttribute('src', 'http://ddragon.leagueoflegends.com/cdn/' + version + '/img/profileicon/' + summoner.profileIconId + '.png');

                //Ranking Request Start
                var rank_req = new XMLHttpRequest();
                rank_req.open("GET", api_url + "/roit_api/index.php?api=positions&method=by-summoner&summoner-id=" + summoner.id + "&region=" + region, true);

                rank_req.onreadystatechange = function () {
                    if (rank_req.readyState === 4) {
                        try {
                            var rank = JSON.parse(rank_req.responseText);

                            if (rank.length > 0) {
                                let solo_q = null;

                                for (var q = 0; q < rank.length; q++) {
                                    if (rank[q].queueType === "RANKED_SOLO_5x5") {
                                        solo_q = q;
                                    }
                                }

                                if (solo_q === null) {
                                    solo_q = 0;
                                }

                                document.getElementById("sum-tier").innerHTML = tiers[rank[solo_q].tier] + " " + ranks[rank[solo_q].rank];
                                document.getElementById("sum-lp").innerHTML = rank[solo_q].leaguePoints;
                                document.getElementById("sum-queue").innerHTML = queues[rank[solo_q].queueType];
                                document.getElementById("sum-wins").innerHTML = "W-" + rank[solo_q].wins;
                                document.getElementById("sum-loss").innerHTML = "L-" + rank[solo_q].losses;
                            }
                            else {
                                document.getElementById("sum-rank").innerHTML = "";
                            }
                        }
                        catch (e) {
                            error = true;
                            console.log(e);
                        }
                        addDevMsg(rank_req.responseText);
                    }
                };
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
                match_req.open("GET", api_url + "matchlistdetail.php?accountId=" + summoner.accountId + "&region=" + region, true);
                //v4 RIOT and new PHP API: sum_req.open("GET", api_url+"/roit_api/index.php?api=matchlists&method=by-account&account="+summoner.accountId+"&region="+region, true);

                console.log("start loading matches...");

                match_req.onreadystatechange = function () {
                    if (match_req.readyState === 4) {
                        try {
                            matches = JSON.parse(match_req.responseText);
                            var matches_length = matches.length;

                            if (matches_length > 0) {
                                var max_match_results = 100;
                                max_match_results = (matches_length < max_match_results) ? matches_length : max_match_results;

                                var matches_html = "";

                                for (var i = 0; i < max_match_results; i++) {
                                    var iswin = (matches[i].win == true) ? "is-win" : "is-loss";
                                    var winbg = (matches[i].win == true) ? "win-bg" : "loss-bg";
                                    var winbordercolor = (matches[i].win == true) ? "is-win-border-color" : "is-loss-border-color";
                                    var m_date = new Date(matches[i].timestamp);

                                    var c_kda;

                                    if (matches[i].deaths != 0) {
                                        c_kda = ((matches[i].kills + matches[i].assists) / matches[i].deaths).toFixed(2);
                                    }
                                    else {
                                        c_kda = "Perfect";
                                    }

                                    let duration = (matches[i].gameDuration / 60).toFixed(0);
                                    let primaryPerk = getRuneReforged(matches[i].perkPrimaryStyle);
                                    let secondaryPerk = getRuneReforged(matches[i].perkSubStyle);

                                    matches_html = matches_html + `
         

                                    <div class="content match-data-wrapper `+ winbordercolor + `" id=match-data-wrapper-` + i + ` data-match-id="` + i + `">
                                        <div id="mobile-match-infos-`+ i + `" class="columns mobile-match-info is-0 is-centered is-variable is-mobile ` + winbg + `" style="margin-top:0 !important; margin-bottom:0 !important">
                                            <div class="column"><p>`+ queue_types[matches[i].queue] + `</p></div>  
                                            <div class="column"><p><strong>`+ gameresults[matches[i].win] + `</strong></p></div>
                          
                                            <div class="column"><p>
                                            <i class="far fa-calendar-alt"></i>
                                            `+ m_date.toLocaleDateString() + `</p>
                                            </div>
                                            <div class="column"><p>
                                            <i class="far fa-clock"></i>
                                            `+ duration + ` min</p>
                                            </div>
                                            <div class="column is-1"><p><span class="icon is-small is-left show-detail-icon"><i class="fas fa-angle-down"></i></span></p></div>
                                        </div>
                        
                                        <div class="columns is-mobile is-0 is-variable is-centered champion-info `+ winbordercolor + ` ` + iswin + `" style="margin-bottom:0 !important; margin-top:0 !important; margin-bottom:0 !important">
                                            <div class="column has-vcentered-content c-sum-icons is-centered">
                                            <div class="c-pic-con">
                                                <img alt="text" class="image is-circle is-64x64" src="https://ddragon.leagueoflegends.com/cdn/`+ version + `/img/champion/` + getChampionData(matches[i].champion).image.full + `">
                                            </div>
                                            <div class="c-sum-spell-con">
                                                <div class="c-sum-spell-1">
                                                    <img alt="text" class="image is-30x30" src="https://ddragon.leagueoflegends.com/cdn/`+ version + `/img/spell/` + getSumSpellData(matches[i].spell1Id).image.full + `">
                                                </div>
                                                <div class="c-sum-spell-2">
                                                    <img alt="text" class="image is-30x30" src="https://ddragon.leagueoflegends.com/cdn/`+ version + `/img/spell/` + getSumSpellData(matches[i].spell2Id).image.full + `">
                                                </div>
                                            </div>
                                            <div class="c-sum-rune-con">
                                                <div class="c-sum-rune-1">
                                                <img alt="text" class="image is-30x30" src="https://ddragon.leagueoflegends.com/cdn/img/`+ primaryPerk.icon + `" alt="` + primaryPerk.name + `">
                                                </div>
                                                <div class="c-sum-rune-2">
                                                    <img alt="text" class="image is-30x30" src="https://ddragon.leagueoflegends.com/cdn/img/`+ secondaryPerk.icon + `" alt="` + secondaryPerk.name + `">
                                                </div>
                                            </div>
                                            </div>
                                            <div class="column has-vcentered-content has-text-centered c-kda-con">
                                            <div><strong><span>`+ matches[i].kills + `</span>/<span>` + matches[i].deaths + `</span>/<span>` + matches[i].assists + `</span></strong></div>
                                            <div>`+ c_kda + ` KDA</div>
                                            <div>`+ matches[i].killParticipation + `% KP</div> 
                                            </div>
                                            <div class="column has-vcentered-content has-text-centered">
                                            <div><span>`+ getChampionData(matches[i].champion).name + `</span> (<span>` + matches[i].level + `</span>)</div>
                                            <div><span style="color:purple"><i class="fas fa-gem"></i></span> `+ matches[i].minions + ` (` + (matches[i].minions / ((matches[i].gameDuration / 60).toFixed(0))).toFixed(2) + `)</div>
                                            <div><span style="color:gold"><i class="fas fa-coins"></i></span> `+ (matches[i].gold / 1000).toFixed(1) + `k</div>
                            
                                            </div>
                                        </div>
                                        <!-- ITEMS -->
                                        <div class="items-wrapper columns is-mobile is-0 is-variable is-centered">
                                            <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-4 is-32x32" src="`+ getItemImage(matches[i].item0) + `"/></div>
                                            <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-4 is-32x32" src="`+ getItemImage(matches[i].item1) + `"/></div>
                                            <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-4 is-32x32" src="`+ getItemImage(matches[i].item2) + `"/></div>
                                            <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-4 is-32x32" src="`+ getItemImage(matches[i].item3) + `"/></div>
                                            <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-4 is-32x32" src="`+ getItemImage(matches[i].item4) + `"/></div>
                                            <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-4 is-32x32" src="`+ getItemImage(matches[i].item5) + `"/></div>
                                            <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-4 is-32x32" src="`+ getItemImage(matches[i].item6) + `"/></div>
                                        </div>
                                        <!-- MATCHDETAILS -->
                                        <div id="match-detail-data-`+ i + `" class="match-detail-data">
                                            <!-- TABS -->
                                            <div class="c-tabs">
                                                <div class="c-tab selected data-overview">Overview</div>
                                                <div class="c-tab data-stats">Stats</div>
                                                <div class="c-tab data-graphs">Graphs</div>
                                                <div class="c-tab data-builds">Builds</div>
                                                <div class="c-tab data-runes">Runes</div>
                                            </div>
                                            <!-- CHAMPIONS -->
                                            <div class="champion-overview detail-match-data columns is-0 is-variable is-centered">`;
                                    for (let team in matches[i].raw.teams) {
                                        let teamId = matches[i].raw.teams[team].teamId;
                                        matches_html = matches_html + `
                                                <div class="team column">
                                                    <div class="champion-container columns is-0 is-variable is-centered">
                                                        <div class="column has-text-centered team-name">Team `+ matches[i].raw.teams[team].win + `</div>`;
                                        for (let participantid in matches[i].raw.participants) {
                                            let participant = matches[i].raw.participants[participantid];
                                            if (participant.teamId === teamId) {
                                                matches_html = matches_html + `
                                                        <div class="column champion">
                                                            <div class="columns is-mobile is-0 is-variable is-centered is-vcentered">
                                                                <div class="column is-narrow">
                                                                    <img alt="text" class="image has-margin-8-left-right is-circle is-48x48" src="https://ddragon.leagueoflegends.com/cdn/`+ version + `/img/champion/` + getChampionData(participant.championId).image.full + `"/>
                                                                </div>
                                                                <div class="column has-vcentered-content">
                                                                    <div class="columns is-mobile is-variable is-centered is-0 is-vcentered">
                                                                        <div class="column champion-info-small">`+ matches[i].raw.participantIdentities[participantid].player.summonerName + `</div>
                                                                        <div class="column champion-info-small">`+ participant.stats.kills + `-` + participant.stats.deaths + `-` + participant.stats.assists + `</div>
                                                                        <div class="column champion-info-small">
                                                                            <div class="columns is-multiline champion-info-icon-container is-mobile is-0 is-variable">
                                                                                <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-2 is-24x24" src="`+ getItemImage(participant.stats.item0) + `"/></div>
                                                                                <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-2 is-24x24" src="`+ getItemImage(participant.stats.item1) + `"/></div>
                                                                                <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-2 is-24x24" src="`+ getItemImage(participant.stats.item2) + `"/></div>
                                                                                <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-2 is-24x24" src="`+ getItemImage(participant.stats.item3) + `"/></div>
                                                                                <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-2 is-24x24" src="`+ getItemImage(participant.stats.item4) + `"/></div>
                                                                                <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-2 is-24x24" src="`+ getItemImage(participant.stats.item5) + `"/></div>
                                                                                <div class="column is-narrow"><img alt="text" class="image has-radius-5 has-margin-2 is-24x24" src="`+ getItemImage(participant.stats.item6) + `"/></div>
                                                                            </div>                                      
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                            }
                                        }
                                        matches_html = matches_html + `
                                                    </div>
                                                </div>`;
                                    }
                                    matches_html = matches_html + `
                                            </div>
                                            <!-- END OF CHAMPIONS -->`;

                                    matches_html = matches_html + `
                                            <div class="summoner-view">
                                                <div class=""></div>
                                                <div>`;
                                    //hier werden die champions erzeugt.
                                    for (let team in matches[i].raw.teams) {
                                        let marginClass = (team < matches[i].raw.teams.length - 1) ? "no-margin-top" : "no-margin-bottom";
                                        let teamId = matches[i].raw.teams[team].teamId;
                                        matches_html = matches_html + `
                                                    <div class="columns `+ marginClass + ` is-mobile is-0 is-variable is-centered ` + winbordercolor + `">`;
                                        for (let participant in matches[i].raw.participants) {
                                            participant = matches[i].raw.participants[participant];
                                            if (participant.teamId === teamId) {
                                                let selected = (participant.participantId === matches[i].partId) ? " selected " : "";
                                                matches_html = matches_html + `
                                                        <div class="column `+ selected + ` summoner-pick is-narrow-desktop is-narrow-tablet is-narrow-mobile has-vcentered-content" data-participant-id="` + participant.participantId + `">
                                                            <img alt="text" class="image has-margin-8-left-right is-circle is-48x48" src="https://ddragon.leagueoflegends.com/cdn/`+ version + `/img/champion/` + getChampionData(participant.championId).image.full + `"/>
                                                        </div>`;
                                            }
                                        }
                                        matches_html = matches_html + `
                                                    </div>`;
                                    }
                                    matches_html = matches_html + `
                                                </div>
                                            </div>
                                            <div id=matchdata-`+ i + ` class="match-data detail-match-data no-margin-top">
                                                `+ getparticipantData(i, matches[i].partId) + `
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                document.getElementById("sum-matches-container").innerHTML = matches_html;
                                console.log(matches_length + " matches loaded.");

                                $('.summoner-pick').click(function () {
                                    let partId = $(this).attr('data-participant-id');
                                    let matchId = $(this).closest('.match-data-wrapper').attr('data-match-id');

                                    if (!$(this).hasClass("selected")) {

                                        $('#match-detail-data-' + matchId).find('.summoner-pick').removeClass("selected");
                                        $(this).addClass("selected");

                                        $('#matchdata-' + matchId).fadeToggle(400, function () {
                                            $('#matchdata-' + matchId).html(getparticipantData(matchId, partId));
                                            $('#matchdata-' + matchId).fadeToggle(400);
                                        });
                                    }
                                });

                                //Click Handlers
                                $('.match-detail-data').on('click', '.data-clickable-header', function () {

                                    let parent = $(this);
                                    let icon = parent.children();
                                    let element = $(this).next();

                                    element.slideToggle(500, function () {
                                        rotateIcon(icon);
                                    });
                                });

                                $('.mobile-match-info').click(function () {
                                    let matchId = $(this).closest('.match-data-wrapper').attr('data-match-id');

                                    $('#match-detail-data-' + matchId).slideToggle(500, rotateIcon($(this).find('.show-detail-icon')));

                                });

                                //Tab Click
                                $('.c-tab').click(function () {
                                    let matchId = $(this).closest('.match-data-wrapper').attr('data-match-id');

                                    $('#match-detail-data-' + matchId + ' .c-tab').removeClass('selected');
                                    $(this).addClass('selected');

                                    $('#match-detail-data-' + matchId + ' .detail-match-data').hide();
                                    $('#match-detail-data-' + matchId + ' .summoner-view').hide();

                                });

                                //Overview Tab
                                $('.data-overview').click(function () {
                                    let matchId = $(this).closest('.match-data-wrapper').attr('data-match-id');
                                    $('#match-detail-data-' + matchId + ' .champion-overview').show();
                                });

                                //Stats Tab
                                $('.data-stats').click(function () {
                                    let matchId = $(this).closest('.match-data-wrapper').attr('data-match-id');
                                    $('#match-detail-data-' + matchId + ' .match-data').show();
                                    $('#match-detail-data-' + matchId + ' .summoner-view').show();
                                });
                            }
                            else {
                                console.log("no matches found");
                            }
                        }
                        catch (e) {
                            //do some debugging here...
                            console.log(e);
                            console.log(match_req.responseText);
                            error = true;
                        }
                        addDevMsg(match_req.responseText);
                    }
                };
                match_req.send(null);
            }
            catch (e) {
                error = true;
                console.log(e);
            }
            addDevMsg(status);
        }
        else {
            //something to do while loading...
        }
        document.getElementById("search-btn").classList.remove("is-loading");

        if (error === true) {
            document.getElementById("req-state").classList.remove("is-success");
            document.getElementById("req-state").classList.add("is-danger");
        }
        else {
            document.getElementById("req-state").classList.remove("is-danger");
            document.getElementById("req-state").classList.add("is-success");
        }
    };
    sum_req.send(null);
}