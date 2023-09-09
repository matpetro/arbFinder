/* fetch('https://odds.p.rapidapi.com/v4/sports?all=true', {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '76fe66a335msh8b2d9ac803072f2p1cad14jsn3b295dcdecb6',
		      'X-RapidAPI-Host': 'odds.p.rapidapi.com'
            }})
            .then(r => r.text())
            .then(text => {
                let data = JSON.parse(text);
                console.log(data);
            }); */

fetch('https://odds.p.rapidapi.com/v4/sports/soccer_epl/odds?regions=us&oddsFormat=decimal&markets=h2h&dateFormat=iso', {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '76fe66a335msh8b2d9ac803072f2p1cad14jsn3b295dcdecb6',
        'X-RapidAPI-Host': 'odds.p.rapidapi.com'
    }})
    .then(r => r.text())
    .then(text => {
        let data = JSON.parse(text);
        console.log(data);
    });