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

// for each game, determine the highest odds for each outcome and keep track of the book keeper
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
                            Bet ${betOnHomeTeam} on ${gameSummary['home']} using ${gameSummary['outcomes']['homeWinBooky']} to win the game \n
                            Bet ${betOnAwayTeam} on ${gameSummary['away']} using ${gameSummary['outcomes']['awayWinBooky']} to win the game \n
                            Bet ${betOnTie} on tie using ${gameSummary['outcomes']['tieBooky']} \n
                            Earnings will be $${earnings}`);
            }
        }
    });


    // TODO:
    //  Extend to other sports from the same api
    //  Extend to other ontario based bookies through web scrapping / api's
    //  Make a web application so that it is easier to see and possibly it can send notifications

    /*
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
}