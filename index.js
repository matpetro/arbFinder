// get the premier league odds from the api
fetch('https://odds.p.rapidapi.com/v4/sports/soccer_epl/odds?regions=us&oddsFormat=decimal&markets=h2h&dateFormat=iso', {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '76fe66a335msh8b2d9ac803072f2p1cad14jsn3b295dcdecb6',
        'X-RapidAPI-Host': 'odds.p.rapidapi.com'
    }})
    .then(r => r.text())
    .then(text => {
        let data = JSON.parse(text);
        //console.log(data);
        checkFootyArb(data);
    });

// for each game, determine the highest odds for each outcome and keep track of the book keeper
function checkFootyArb(matchDetails){
    matchDetails.forEach(game => {
        let bookmakers = game['bookmakers'];
        if (bookmakers.length){
            let maxTieOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][2]['price'] > game['markets'][0]['outcomes'][2]['price'] ? max : game);
            let maxAwayWinOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][0]['price'] > game['markets'][0]['outcomes'][0]['price'] ? max : game);
            let maxHomeWinOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][1]['price'] > game['markets'][0]['outcomes'][1]['price'] ? max : game);

            console.log(`Best Tie odds for ${game['home_team']} (H) vs ${game['away_team']} (A) : ${maxTieOdds['title']} ${maxTieOdds['markets'][0]['outcomes'][2]['price']}`);
            console.log(`Best Away Win odds for ${game['home_team']} (H) vs ${game['away_team']} (A) : ${maxAwayWinOdds['title']} ${maxAwayWinOdds['markets'][0]['outcomes'][0]['price']}`);
            console.log(`Best Home Win odds for ${game['home_team']} (H) vs ${game['away_team']} (A) : ${maxHomeWinOdds['title']} ${maxHomeWinOdds['markets'][0]['outcomes'][1]['price']}`);
        }

        // Now do the arbitrage calc
    });
}