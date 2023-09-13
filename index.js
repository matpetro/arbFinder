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
        checkThreeOutcomeArb(data);
    });

// football odds
fetch('https://odds.p.rapidapi.com/v4/sports/americanfootball_nfl/odds?regions=us&oddsFormat=decimal&markets=h2h&dateFormat=iso', {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '76fe66a335msh8b2d9ac803072f2p1cad14jsn3b295dcdecb6',
        'X-RapidAPI-Host': 'odds.p.rapidapi.com'
    }})
    .then(r => r.text())
    .then(text => {
        let data = JSON.parse(text);
        //console.log(data);
        checkTwoOutcomeArb(data);
    });

// baseball odds
fetch('https://odds.p.rapidapi.com/v4/sports/baseball_mlb/odds?regions=us&oddsFormat=decimal&markets=h2h&dateFormat=iso', {
  method: 'GET',
  headers: {
      'X-RapidAPI-Key': '76fe66a335msh8b2d9ac803072f2p1cad14jsn3b295dcdecb6',
      'X-RapidAPI-Host': 'odds.p.rapidapi.com'
  }})
  .then(r => r.text())
  .then(text => {
      let data = JSON.parse(text);
      //console.log(data);
      checkTwoOutcomeArb(data);
  });

/* // hockey odds
fetch('https://odds.p.rapidapi.com/v4/sports/icehockey_nhl/odds?regions=us&oddsFormat=decimal&markets=h2h&dateFormat=iso', {
  method: 'GET',
  headers: {
      'X-RapidAPI-Key': '76fe66a335msh8b2d9ac803072f2p1cad14jsn3b295dcdecb6',
      'X-RapidAPI-Host': 'odds.p.rapidapi.com'
  }})
  .then(r => r.text())
  .then(text => {
      let data = JSON.parse(text);
      //console.log(data);
      checkTwoOutcomeArb(data);
  });
// basketball odds
fetch('https://odds.p.rapidapi.com/v4/sports/basketball_nba/odds?regions=us&oddsFormat=decimal&markets=h2h&dateFormat=iso', {
  method: 'GET',
  headers: {
      'X-RapidAPI-Key': '76fe66a335msh8b2d9ac803072f2p1cad14jsn3b295dcdecb6',
      'X-RapidAPI-Host': 'odds.p.rapidapi.com'
  }})
  .then(r => r.text())
  .then(text => {
      let data = JSON.parse(text);
      //console.log(data);
      checkTwoOutcomeArb(data);
  }); */

function checkThreeOutcomeArb(matchDetails){
    matchDetails.forEach(game => {
        let bookmakers = game['bookmakers'];
        if (bookmakers.length){
            let maxTieOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][2]['price'] > game['markets'][0]['outcomes'][2]['price'] ? max : game);
            let maxAwayWinOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][0]['price'] > game['markets'][0]['outcomes'][0]['price'] ? max : game);
            let maxHomeWinOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][1]['price'] > game['markets'][0]['outcomes'][1]['price'] ? max : game);

            let gameSummary = {'away' : game['away_team'], 'home': game['home_team'], 'outcomes': {'maxHomeWinOdds' : maxHomeWinOdds['markets'][0]['outcomes'][1]['price'],
                'homeWinBooky': maxHomeWinOdds['title'], 'maxAwayWinOdds' : maxAwayWinOdds['markets'][0]['outcomes'][0]['price'], 'awayWinBooky' : maxAwayWinOdds['title'], 
                'tieBooky' : maxTieOdds['title'], 'maxTieOdds' : maxTieOdds['markets'][0]['outcomes'][2]['price']
            }};

            // console.log(`Best Tie odds for ${gameSummary['home']} (H) vs ${gameSummary['away']} (A) : ${gameSummary['outcomes']['tieBooky']} ${gameSummary['outcomes']['maxTieOdds']}`);
            // console.log(`Best Away Win odds for ${gameSummary['home']} (H) vs ${gameSummary['away']} (A) : ${gameSummary['outcomes']['awayWinBooky']} ${gameSummary['outcomes']['maxAwayWinOdds']}`);
            // console.log(`Best Home Win odds for ${gameSummary['home']} (H) vs ${gameSummary['away']} (A) : ${gameSummary['outcomes']['homeWinBooky']} ${gameSummary['outcomes']['maxHomeWinOdds']}`);

            // Now do the arbitrage calc
            let oddsMargin = 1/gameSummary['outcomes']['maxTieOdds'] + 1/gameSummary['outcomes']['maxAwayWinOdds'] + 1/gameSummary['outcomes']['maxHomeWinOdds'];

            console.log(`Odds Margin for ${gameSummary['away']} vs ${gameSummary['home']} : ${oddsMargin}`);

            if (oddsMargin < 1) {
                console.log("ARBITRAGE OPPURTUNITY DETECTED");
                // calculate the bets to make based on a 1000 total
                let totalBet = 1000;

                let betOnHomeTeam = Math.round(1000 / (1 + gameSummary['outcomes']['maxHomeWinOdds']/gameSummary['outcomes']['maxTieOdds'] + gameSummary['outcomes']['maxHomeWinOdds']/gameSummary['outcomes']['maxAwayWinOdds']), 2);
                let betOnAwayTeam = Math.round(1000 / (1 + gameSummary['outcomes']['maxAwayWinOdds']/gameSummary['outcomes']['maxTieOdds'] + gameSummary['outcomes']['maxAwayWinOdds']/gameSummary['outcomes']['maxHomeWinOdds']), 2);
                let betOnTie = 1000 - betOnHomeTeam - betOnAwayTeam;
                let earnings = betOnHomeTeam * gameSummary['outcomes']['maxHomeWinOdds'] - totalBet;

                console.log(`Bet Summary: 
                            Bet ${betOnHomeTeam} on ${gameSummary['home']} using ${gameSummary['outcomes']['homeWinBooky']} (${gameSummary['outcomes']['maxHomeWinOdds']}) to win the game \n
                            Bet ${betOnAwayTeam} on ${gameSummary['away']} using ${gameSummary['outcomes']['awayWinBooky']} (${gameSummary['outcomes']['maxAwayWinOdds']}) to win the game \n
                            Bet ${betOnTie} on tie using ${gameSummary['outcomes']['tieBooky']} (${gameSummary['outcomes']['maxTieOdds']}) \n
                            Earnings will be $${earnings}`);
            }
        }
    });
}

function checkTwoOutcomeArb(matchDetails){
  matchDetails.forEach(game => {
      let bookmakers = game['bookmakers'];
      if (bookmakers.length){
          let maxAwayWinOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][0]['price'] > game['markets'][0]['outcomes'][0]['price'] ? max : game);
          let maxHomeWinOdds = bookmakers.reduce((max, game) => max['markets'][0]['outcomes'][1]['price'] > game['markets'][0]['outcomes'][1]['price'] ? max : game);

          let gameSummary = {'away' : game['away_team'], 'home': game['home_team'], 'outcomes': {'maxHomeWinOdds' : maxHomeWinOdds['markets'][0]['outcomes'][1]['price'],
              'homeWinBooky': maxHomeWinOdds['title'], 'maxAwayWinOdds' : maxAwayWinOdds['markets'][0]['outcomes'][0]['price'], 'awayWinBooky' : maxAwayWinOdds['title']
          }};

          // console.log(`Best Away Win odds for ${gameSummary['home']} (H) vs ${gameSummary['away']} (A) : ${gameSummary['outcomes']['awayWinBooky']} ${gameSummary['outcomes']['maxAwayWinOdds']}`);
          // console.log(`Best Home Win odds for ${gameSummary['home']} (H) vs ${gameSummary['away']} (A) : ${gameSummary['outcomes']['homeWinBooky']} ${gameSummary['outcomes']['maxHomeWinOdds']}`);

          // Now do the arbitrage calc
          let oddsMargin = 1/gameSummary['outcomes']['maxAwayWinOdds'] + 1/gameSummary['outcomes']['maxHomeWinOdds'];

          console.log(`Odds Margin for ${gameSummary['away']} vs ${gameSummary['home']} : ${oddsMargin}`);

          if (oddsMargin < 1) {
              console.log("ARBITRAGE OPPURTUNITY DETECTED");
              // calculate the bets to make based on a 1000 total
              let totalBet = 1000;

              let betOnHomeTeam = Math.round(1000 / (1 + gameSummary['outcomes']['maxHomeWinOdds']/gameSummary['outcomes']['maxAwayWinOdds']), 2);
              let betOnAwayTeam = Math.round(1000 / (1 + gameSummary['outcomes']['maxAwayWinOdds']/gameSummary['outcomes']['maxHomeWinOdds']), 2);
              let earnings = betOnHomeTeam * gameSummary['outcomes']['maxHomeWinOdds'] - totalBet;

              console.log(`Bet Summary: 
              Bet ${betOnHomeTeam} on ${gameSummary['home']} using ${gameSummary['outcomes']['homeWinBooky']} (${gameSummary['outcomes']['maxHomeWinOdds']}) to win the game \n
              Bet ${betOnAwayTeam} on ${gameSummary['away']} using ${gameSummary['outcomes']['awayWinBooky']} (${gameSummary['outcomes']['maxAwayWinOdds']}) to win the game \n
              Earnings will be $${earnings}`);
          }
      }
  });
}


    // TODO:
    //  Extend to other sports from the same api (other soccer leagues, basketball, baseball, football, hockey)
    // Do an Initial check to see if the sports are active first
    //  Extend to other ontario based bookies through web scrapping / api's
    //  Make a web application so that it is easier to see and possibly it can send notifications

    /*
    Sports sample
    [
  {
    "key": "americanfootball_cfl",
    "group": "American Football",
    "title": "CFL",
    "description": "Canadian Football League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "americanfootball_ncaaf",
    "group": "American Football",
    "title": "NCAAF",
    "description": "US College Football",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "americanfootball_nfl",
    "group": "American Football",
    "title": "NFL",
    "description": "US Football",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "americanfootball_nfl_preseason",
    "group": "American Football",
    "title": "NFL Preseason",
    "description": "US Football",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "americanfootball_nfl_super_bowl_winner",
    "group": "American Football",
    "title": "NFL Super Bowl Winner",
    "description": "Super Bowl Winner 2023/2024",
    "active": true,
    "has_outrights": true
  },
  {
    "key": "americanfootball_xfl",
    "group": "American Football",
    "title": "XFL",
    "description": "US Football",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "aussierules_afl",
    "group": "Aussie Rules",
    "title": "AFL",
    "description": "Aussie Football",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "baseball_mlb",
    "group": "Baseball",
    "title": "MLB",
    "description": "Major League Baseball",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "baseball_mlb_preseason",
    "group": "Baseball",
    "title": "MLB Preseason",
    "description": "Major League Baseball",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "baseball_mlb_world_series_winner",
    "group": "Baseball",
    "title": "MLB World Series Winner",
    "description": "World Series Winner 2023",
    "active": true,
    "has_outrights": true
  },
  {
    "key": "baseball_ncaa",
    "group": "Baseball",
    "title": "NCAA Baseball",
    "description": "US College Baseball",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "basketball_euroleague",
    "group": "Basketball",
    "title": "Basketball Euroleague",
    "description": "Basketball Euroleague",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "basketball_nba",
    "group": "Basketball",
    "title": "NBA",
    "description": "US Basketball",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "basketball_nba_championship_winner",
    "group": "Basketball",
    "title": "NBA Championship Winner",
    "description": "Championship Winner 2022/2023",
    "active": true,
    "has_outrights": true
  },
  {
    "key": "basketball_nba_preseason",
    "group": "Basketball",
    "title": "NBA Preseason",
    "description": "US Basketball",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "basketball_ncaab",
    "group": "Basketball",
    "title": "NCAAB",
    "description": "US College Basketball",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "basketball_wnba",
    "group": "Basketball",
    "title": "WNBA",
    "description": "US Basketball",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "boxing_boxing",
    "group": "Boxing",
    "title": "Boxing",
    "description": "Boxing Bouts",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "cricket_asia_cup",
    "group": "Cricket",
    "title": "Asia Cup",
    "description": "Asia Cup",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "cricket_big_bash",
    "group": "Cricket",
    "title": "Big Bash",
    "description": "Big Bash League",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "cricket_caribbean_premier_league",
    "group": "Cricket",
    "title": "CPLT20",
    "description": "Caribbean Premier League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "cricket_icc_world_cup",
    "group": "Cricket",
    "title": "ICC World Cup",
    "description": "ICC World Cup",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "cricket_international_t20",
    "group": "Cricket",
    "title": "International Twenty20",
    "description": "International Twenty20",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "cricket_ipl",
    "group": "Cricket",
    "title": "IPL",
    "description": "Indian Premier League",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "cricket_odi",
    "group": "Cricket",
    "title": "One Day Internationals",
    "description": "One Day Internationals",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "cricket_psl",
    "group": "Cricket",
    "title": "Pakistan Super League",
    "description": "Pakistan Super League",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "cricket_t20_blast",
    "group": "Cricket",
    "title": "T20 Blast",
    "description": "T20 Blast",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "cricket_test_match",
    "group": "Cricket",
    "title": "Test Matches",
    "description": "International Test Matches",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "cricket_the_hundred",
    "group": "Cricket",
    "title": "The Hundred",
    "description": "The Hundred",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "golf_masters_tournament_winner",
    "group": "Golf",
    "title": "Masters Tournament Winner",
    "description": "2024 Winner",
    "active": true,
    "has_outrights": true
  },
  {
    "key": "golf_pga_championship_winner",
    "group": "Golf",
    "title": "PGA Championship Winner",
    "description": "2024 Winner",
    "active": true,
    "has_outrights": true
  },
  {
    "key": "golf_the_open_championship_winner",
    "group": "Golf",
    "title": "The Open Winner",
    "description": "2023 Winner",
    "active": false,
    "has_outrights": true
  },
  {
    "key": "golf_us_open_winner",
    "group": "Golf",
    "title": "US Open Winner",
    "description": "2023 Winner",
    "active": true,
    "has_outrights": true
  },
  {
    "key": "icehockey_nhl",
    "group": "Ice Hockey",
    "title": "NHL",
    "description": "US Ice Hockey",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "icehockey_nhl_championship_winner",
    "group": "Ice Hockey",
    "title": "NHL Championship Winner",
    "description": "Stanley Cup Winner 2022/2023",
    "active": true,
    "has_outrights": true
  },
  {
    "key": "icehockey_sweden_allsvenskan",
    "group": "Ice Hockey",
    "title": "HockeyAllsvenskan",
    "description": "Swedish Hockey Allsvenskan",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "icehockey_sweden_hockey_league",
    "group": "Ice Hockey",
    "title": "SHL",
    "description": "Swedish Hockey League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "mma_mixed_martial_arts",
    "group": "Mixed Martial Arts",
    "title": "MMA",
    "description": "Mixed Martial Arts",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "politics_us_presidential_election_winner",
    "group": "Politics",
    "title": "US Presidential Elections Winner",
    "description": "2024 US Presidential Election Winner",
    "active": false,
    "has_outrights": true
  },
  {
    "key": "rugbyleague_nrl",
    "group": "Rugby League",
    "title": "NRL",
    "description": "Aussie Rugby League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "rugbyunion_world_cup",
    "group": "Rugby Union",
    "title": "World Cup",
    "description": "World Cup 2023",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_africa_cup_of_nations",
    "group": "Soccer",
    "title": "Africa Cup of Nations",
    "description": "Africa Cup of Nations",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_argentina_primera_division",
    "group": "Soccer",
    "title": "Primera División - Argentina",
    "description": "Argentine Primera División",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_australia_aleague",
    "group": "Soccer",
    "title": "A-League",
    "description": "Aussie Soccer",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_austria_bundesliga",
    "group": "Soccer",
    "title": "Austrian Football Bundesliga",
    "description": "Austrian Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_belgium_first_div",
    "group": "Soccer",
    "title": "Belgium First Div",
    "description": "Belgian First Division A",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_brazil_campeonato",
    "group": "Soccer",
    "title": "Brazil Série A",
    "description": "Brasileirão Série A",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_brazil_serie_b",
    "group": "Soccer",
    "title": "Brazil Série B",
    "description": "Campeonato Brasileiro Série B",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_chile_campeonato",
    "group": "Soccer",
    "title": "Primera División - Chile",
    "description": "Campeonato Chileno",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_china_superleague",
    "group": "Soccer",
    "title": "Super League - China",
    "description": "Chinese Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_conmebol_copa_libertadores",
    "group": "Soccer",
    "title": "Copa Libertadores",
    "description": "CONMEBOL Copa Libertadores",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_denmark_superliga",
    "group": "Soccer",
    "title": "Denmark Superliga",
    "description": "Danish Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_efl_champ",
    "group": "Soccer",
    "title": "Championship",
    "description": "EFL Championship",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_england_efl_cup",
    "group": "Soccer",
    "title": "EFL Cup",
    "description": "League Cup",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_england_league1",
    "group": "Soccer",
    "title": "League 1",
    "description": "EFL League 1",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_england_league2",
    "group": "Soccer",
    "title": "League 2",
    "description": "EFL League 2 ",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_epl",
    "group": "Soccer",
    "title": "EPL",
    "description": "English Premier League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_fa_cup",
    "group": "Soccer",
    "title": "FA Cup",
    "description": "Football Association Challenge Cup",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_fifa_world_cup",
    "group": "Soccer",
    "title": "FIFA World Cup",
    "description": "FIFA World Cup 2022",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_fifa_world_cup_winner",
    "group": "Soccer",
    "title": "FIFA World Cup Winner",
    "description": "FIFA World Cup Winner 2022",
    "active": false,
    "has_outrights": true
  },
  {
    "key": "soccer_fifa_world_cup_womens",
    "group": "Soccer",
    "title": "FIFA Women's World Cup",
    "description": "FIFA Women's World Cup",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_finland_veikkausliiga",
    "group": "Soccer",
    "title": "Veikkausliiga - Finland",
    "description": "Finnish  Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_france_ligue_one",
    "group": "Soccer",
    "title": "Ligue 1 - France",
    "description": "French Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_france_ligue_two",
    "group": "Soccer",
    "title": "Ligue 2 - France",
    "description": "French Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_germany_bundesliga",
    "group": "Soccer",
    "title": "Bundesliga - Germany",
    "description": "German Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_germany_bundesliga2",
    "group": "Soccer",
    "title": "Bundesliga 2 - Germany",
    "description": "German Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_germany_liga3",
    "group": "Soccer",
    "title": "3. Liga - Germany",
    "description": "German Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_greece_super_league",
    "group": "Soccer",
    "title": "Super League - Greece",
    "description": "Greek Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_italy_serie_a",
    "group": "Soccer",
    "title": "Serie A - Italy",
    "description": "Italian Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_italy_serie_b",
    "group": "Soccer",
    "title": "Serie B - Italy",
    "description": "Italian Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_japan_j_league",
    "group": "Soccer",
    "title": "J League",
    "description": "Japan Soccer League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_korea_kleague1",
    "group": "Soccer",
    "title": "K League 1",
    "description": "Korean Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_league_of_ireland",
    "group": "Soccer",
    "title": "League of Ireland",
    "description": "Airtricity League Premier Division",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_mexico_ligamx",
    "group": "Soccer",
    "title": "Liga MX",
    "description": "Mexican Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_netherlands_eredivisie",
    "group": "Soccer",
    "title": "Dutch Eredivisie",
    "description": "Dutch Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_norway_eliteserien",
    "group": "Soccer",
    "title": "Eliteserien - Norway",
    "description": "Norwegian Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_poland_ekstraklasa",
    "group": "Soccer",
    "title": "Ekstraklasa - Poland",
    "description": "Polish Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_portugal_primeira_liga",
    "group": "Soccer",
    "title": "Primeira Liga - Portugal",
    "description": "Portugese Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_spain_la_liga",
    "group": "Soccer",
    "title": "La Liga - Spain",
    "description": "Spanish Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_spain_segunda_division",
    "group": "Soccer",
    "title": "La Liga 2 - Spain",
    "description": "Spanish Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_spl",
    "group": "Soccer",
    "title": "Premiership - Scotland",
    "description": "Scottish Premiership",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_sweden_allsvenskan",
    "group": "Soccer",
    "title": "Allsvenskan - Sweden",
    "description": "Swedish Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_sweden_superettan",
    "group": "Soccer",
    "title": "Superettan - Sweden",
    "description": "Swedish Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_switzerland_superleague",
    "group": "Soccer",
    "title": "Swiss Superleague",
    "description": "Swiss Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_turkey_super_league",
    "group": "Soccer",
    "title": "Turkey Super League",
    "description": "Turkish Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_uefa_champs_league",
    "group": "Soccer",
    "title": "UEFA Champions League",
    "description": "European Champions League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_uefa_champs_league_qualification",
    "group": "Soccer",
    "title": "UEFA Champions League Qualification",
    "description": "European Champions League Qualification",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_uefa_europa_conference_league",
    "group": "Soccer",
    "title": "UEFA Europa Conference League",
    "description": "UEFA Europa Conference League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_uefa_europa_league",
    "group": "Soccer",
    "title": "UEFA Europa League",
    "description": "European Europa League",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "soccer_uefa_nations_league",
    "group": "Soccer",
    "title": "UEFA Nations League",
    "description": "UEFA Nations League",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "soccer_usa_mls",
    "group": "Soccer",
    "title": "MLS",
    "description": "Major League Soccer",
    "active": true,
    "has_outrights": false
  },
  {
    "key": "tennis_atp_aus_open_singles",
    "group": "Tennis",
    "title": "ATP Australian Open",
    "description": "Men's Singles",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "tennis_atp_french_open",
    "group": "Tennis",
    "title": "ATP French Open",
    "description": "Men's Singles",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "tennis_atp_us_open",
    "group": "Tennis",
    "title": "ATP US Open",
    "description": "Men's Singles",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "tennis_atp_wimbledon",
    "group": "Tennis",
    "title": "ATP Wimbledon",
    "description": "Men's Singles",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "tennis_wta_aus_open_singles",
    "group": "Tennis",
    "title": "WTA Australian Open",
    "description": "Women's Singles",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "tennis_wta_french_open",
    "group": "Tennis",
    "title": "WTA French Open",
    "description": "Women's Singles",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "tennis_wta_us_open",
    "group": "Tennis",
    "title": "WTA US Open",
    "description": "Women's Singles",
    "active": false,
    "has_outrights": false
  },
  {
    "key": "tennis_wta_wimbledon",
    "group": "Tennis",
    "title": "WTA Wimbledon",
    "description": "Women's Singles",
    "active": false,
    "has_outrights": false
  }
]

    Upcoming Sample
    [
         {
          "id": "75ed80de6f3c92901ded0ad2ce6f00f8",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T20:40:00Z",
          "home_team": "Chicago White Sox",
          "away_team": "Kansas City Royals",
          "bookmakers": [
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.01
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 34
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.02
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 15
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 176
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "cf0753db3afd56d6e5fab6feedfa3e50",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T22:35:00Z",
          "home_team": "Baltimore Orioles",
          "away_team": "St. Louis Cardinals",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.1
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.71
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:12:27Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:27Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.16
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.68
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.1
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.71
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 1.95
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.1
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.7
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.05
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.67
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.05
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.71
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.14
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.68
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.14
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.68
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Baltimore Orioles",
                      "price": 2.1
                    },
                    {
                      "name": "St. Louis Cardinals",
                      "price": 1.69
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "0a36f6041762f931356da6812306ca3e",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T22:35:00Z",
          "home_team": "Pittsburgh Pirates",
          "away_team": "Washington Nationals",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.18
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 4.7
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.24
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 3.9
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.18
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 4.5
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.18
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 4.4
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.2
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 4.4
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.22
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 4.2
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.19
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 4.4
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.23
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 3.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.17
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 5
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Pittsburgh Pirates",
                      "price": 1.17
                    },
                    {
                      "name": "Washington Nationals",
                      "price": 5
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "05c14c368d094336a5364f20a5682ce1",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T22:40:00Z",
          "home_team": "Philadelphia Phillies",
          "away_team": "Atlanta Braves",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.83
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.91
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.82
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.96
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.91
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.83
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.95
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.9
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.85
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.77
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 2
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.8
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.87
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.85
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.93
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 1.85
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.93
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Atlanta Braves",
                      "price": 2
                    },
                    {
                      "name": "Philadelphia Phillies",
                      "price": 1.77
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "90ce4228a8421d22024e98ff181a051f",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T22:40:00Z",
          "home_team": "Detroit Tigers",
          "away_team": "Cincinnati Reds",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:12:17Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:17Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 3.9
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.24
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:12:27Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:27Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 4.1
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.22
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 1
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 3.7
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.29
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 3.9
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.22
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:03Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:03Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 3.8
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.25
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 3.4
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.3
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 3.85
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.2
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 4.35
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.21
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Cincinnati Reds",
                      "price": 4.35
                    },
                    {
                      "name": "Detroit Tigers",
                      "price": 1.21
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "e415502c35e318c5a1e8339bbccbfafc",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T23:07:00Z",
          "home_team": "Toronto Blue Jays",
          "away_team": "Texas Rangers",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.87
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.87
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:07:03Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:07:03Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.9
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 2.01
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:07:04Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:07:04Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.95
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.87
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:06:43Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:06:43Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.92
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.99
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:07:58Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:07:58Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.9
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 2.01
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.91
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.86
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.95
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 2
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.95
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.74
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.95
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.95
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:06:34Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:06:34Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.91
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.94
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.96
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:05:23Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:05:23Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.87
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.97
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 1.96
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Texas Rangers",
                      "price": 2
                    },
                    {
                      "name": "Toronto Blue Jays",
                      "price": 1.77
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "725a53137d523a689adbbfb415f277a7",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T23:10:00Z",
          "home_team": "New York Mets",
          "away_team": "Arizona Diamondbacks",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:12:17Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:17Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.77
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:09:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:09:29Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.04
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.88
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.06
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.75
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 1.95
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 1.9
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 1.95
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:10:46Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:10:46Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.01
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.77
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 1.91
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 1.95
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.83
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:07:48Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:07:48Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 1.92
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.93
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.04
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.77
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.04
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.77
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:09:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:09:29Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.02
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.85
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:10:53Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:10:53Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.04
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.88
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:09:39Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:09:39Z",
                  "outcomes": [
                    {
                      "name": "Arizona Diamondbacks",
                      "price": 2.04
                    },
                    {
                      "name": "New York Mets",
                      "price": 1.88
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "9af6f155e191032299cb10d8fd355cc6",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T23:15:00Z",
          "home_team": "Boston Red Sox",
          "away_team": "New York Yankees",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.71
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:12:34Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:34Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.78
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.18
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.77
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:11:25Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:11:25Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.79
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.17
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:09:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:09:29Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.79
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.17
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.76
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.12
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.77
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.77
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:09:35Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:09:35Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.76
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.07
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:09:14Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:09:14Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.77
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.78
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.78
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.08
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:06:57Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:06:57Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.78
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:09:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:09:29Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.77
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Boston Red Sox",
                      "price": 1.74
                    },
                    {
                      "name": "New York Yankees",
                      "price": 2.05
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "bc0e718af1aa5a07c912b3508823ff40",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T23:40:00Z",
          "home_team": "Chicago White Sox",
          "away_team": "Kansas City Royals",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.74
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.14
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:13:08Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:08Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.79
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.16
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.74
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.77
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.77
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.79
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.08
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.79
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.08
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.79
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.08
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.77
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:13:09Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:09Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.78
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.18
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:13:06Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:06Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.78
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.18
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.77
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.75
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.11
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Chicago White Sox",
                      "price": 1.77
                    },
                    {
                      "name": "Kansas City Royals",
                      "price": 2.1
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "afcff3399a7f3e97cd81a4c2503ef251",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T23:40:00Z",
          "home_team": "Milwaukee Brewers",
          "away_team": "Miami Marlins",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.36
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.62
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.4
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.59
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.38
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.61
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:13:08Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:08Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.44
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.63
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.35
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.35
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.62
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.4
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.61
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.4
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.35
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.62
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.45
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.57
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.48
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.57
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.48
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.57
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.37
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.62
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:13:06Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:06Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.4
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.65
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:13:09Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:09Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.4
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.65
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Miami Marlins",
                      "price": 2.45
                    },
                    {
                      "name": "Milwaukee Brewers",
                      "price": 1.63
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "bf474cb00cf6fb7add9a7f5214871ae8",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-12T23:40:00Z",
          "home_team": "Minnesota Twins",
          "away_team": "Tampa Bay Rays",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.8
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.05
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:13:08Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:08Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.84
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.09
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:13:09Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:09Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.83
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.11
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.8
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.05
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:13:06Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:06Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.83
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.11
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.77
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.77
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.77
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.81
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.12
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.78
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.06
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.77
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.81
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.06
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.78
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.08
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.78
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.78
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Minnesota Twins",
                      "price": 1.78
                    },
                    {
                      "name": "Tampa Bay Rays",
                      "price": 2.07
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "2a0d22757baaa1bd5e80ddbabc8e0423",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-13T00:10:00Z",
          "home_team": "Houston Astros",
          "away_team": "Oakland Athletics",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.31
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.31
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.5
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:13:06Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:06Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.33
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.62
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:13:08Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:08Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.32
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.5
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:13:09Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:09Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.33
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.62
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.3
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.65
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.31
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.33
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.4
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.33
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.67
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.3
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.54
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.32
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.45
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.32
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.55
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.32
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.55
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.32
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.55
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.3
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.65
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Houston Astros",
                      "price": 1.31
                    },
                    {
                      "name": "Oakland Athletics",
                      "price": 3.5
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "eb9533b92ec425e3269b7e77ac12402f",
          "sport_key": "mma_mixed_martial_arts",
          "sport_title": "MMA",
          "commence_time": "2023-09-13T00:15:00Z",
          "home_team": "Kasey Tanner",
          "away_team": "Jean Matsumoto",
          "bookmakers": [
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:13:02Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Jean Matsumoto",
                      "price": 1.95
                    },
                    {
                      "name": "Kasey Tanner",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:14Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:14Z",
                  "outcomes": [
                    {
                      "name": "Jean Matsumoto",
                      "price": 1.91
                    },
                    {
                      "name": "Kasey Tanner",
                      "price": 1.8
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:42Z",
                  "outcomes": [
                    {
                      "name": "Jean Matsumoto",
                      "price": 2.06
                    },
                    {
                      "name": "Kasey Tanner",
                      "price": 1.79
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:12:40Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:40Z",
                  "outcomes": [
                    {
                      "name": "Jean Matsumoto",
                      "price": 2
                    },
                    {
                      "name": "Kasey Tanner",
                      "price": 1.77
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "d617574d9e650392a5352b79016fb0ba",
          "sport_key": "baseball_mlb",
          "sport_title": "MLB",
          "commence_time": "2023-09-13T00:40:00Z",
          "home_team": "Colorado Rockies",
          "away_team": "Chicago Cubs",
          "bookmakers": [
            {
              "key": "draftkings",
              "title": "DraftKings",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.56
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.5
                    }
                  ]
                }
              ]
            },
            {
              "key": "williamhill_us",
              "title": "William Hill (US)",
              "last_update": "2023-09-12T23:13:01Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.53
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.58
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:13:06Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:06Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.58
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.57
                    }
                  ]
                }
              ]
            },
            {
              "key": "betus",
              "title": "BetUS",
              "last_update": "2023-09-12T23:13:08Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:08Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.56
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "betonlineag",
              "title": "BetOnline.ag",
              "last_update": "2023-09-12T23:13:09Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:09Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.58
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.57
                    }
                  ]
                }
              ]
            },
            {
              "key": "barstool",
              "title": "Barstool Sportsbook",
              "last_update": "2023-09-12T23:12:56Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:56Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.54
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.55
                    }
                  ]
                }
              ]
            },
            {
              "key": "betmgm",
              "title": "BetMGM",
              "last_update": "2023-09-12T23:12:29Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:29Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.54
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.5
                    }
                  ]
                }
              ]
            },
            {
              "key": "wynnbet",
              "title": "WynnBET",
              "last_update": "2023-09-12T23:12:32Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:32Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.57
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.57
                    }
                  ]
                }
              ]
            },
            {
              "key": "fanduel",
              "title": "FanDuel",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.54
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.56
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.56
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.55
                    }
                  ]
                }
              ]
            },
            {
              "key": "mybookieag",
              "title": "MyBookie.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:44Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.53
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.52
                    }
                  ]
                }
              ]
            },
            {
              "key": "pointsbetus",
              "title": "PointsBet (US)",
              "last_update": "2023-09-12T23:12:51Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:51Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.53
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "betrivers",
              "title": "BetRivers",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.53
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:11Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:11Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.53
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "twinspires",
              "title": "TwinSpires",
              "last_update": "2023-09-12T23:13:12Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:12Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.53
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.6
                    }
                  ]
                }
              ]
            },
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:43Z",
                  "outcomes": [
                    {
                      "name": "Chicago Cubs",
                      "price": 1.55
                    },
                    {
                      "name": "Colorado Rockies",
                      "price": 2.51
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "002a2ce8445af2959ea816093f3891da",
          "sport_key": "mma_mixed_martial_arts",
          "sport_title": "MMA",
          "commence_time": "2023-09-13T00:45:00Z",
          "home_team": "Patricia Alujas",
          "away_team": "Julia Polastri",
          "bookmakers": [
            {
              "key": "bovada",
              "title": "Bovada",
              "last_update": "2023-09-12T23:13:02Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:01Z",
                  "outcomes": [
                    {
                      "name": "Julia Polastri",
                      "price": 1.15
                    },
                    {
                      "name": "Patricia Alujas",
                      "price": 5.5
                    }
                  ]
                }
              ]
            },
            {
              "key": "unibet_us",
              "title": "Unibet",
              "last_update": "2023-09-12T23:13:14Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:13:14Z",
                  "outcomes": [
                    {
                      "name": "Julia Polastri",
                      "price": 1.15
                    },
                    {
                      "name": "Patricia Alujas",
                      "price": 5.1
                    }
                  ]
                }
              ]
            },
            {
              "key": "lowvig",
              "title": "LowVig.ag",
              "last_update": "2023-09-12T23:12:44Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:42Z",
                  "outcomes": [
                    {
                      "name": "Julia Polastri",
                      "price": 1.13
                    },
                    {
                      "name": "Patricia Alujas",
                      "price": 6.5
                    }
                  ]
                }
              ]
            },
            {
              "key": "superbook",
              "title": "SuperBook",
              "last_update": "2023-09-12T23:12:40Z",
              "markets": [
                {
                  "key": "h2h",
                  "last_update": "2023-09-12T23:12:40Z",
                  "outcomes": [
                    {
                      "name": "Julia Polastri",
                      "price": 1.15
                    },
                    {
                      "name": "Patricia Alujas",
                      "price": 5.25
                    }
                  ]
                }
              ]
            }
          ]
        }
      ] */