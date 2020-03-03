function getRoundNo(round) {
    return round == 'First' ? 1 :
            round == 'Second' ? 2 :
            round == 'Third' ? 3 :
            round == 'Fourth' ? 4 :
            round == 'quarter' ? 5 :
            round == 'semi' ? 6 : 7
}

function getTopPlayers(start=0, end=10) {
    // console.log(data[0])
    let most_wins = d3.nest()
        .key(function (d) {return d.winner })
        .rollup(function (d) { return d.length })
        .entries(data);

    let sorted_data = most_wins.sort(function (d1, d2) {
    return d2.value - d1.value
    });

    return sorted_data.slice(start, end);
}

function constructPlayerAttributeComparisonData(player) {
    let player_data = getPlayerAttributes(player)
    let avg_stats = getAverageStats();

    return [
        {
            key: 'firstServe', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.firstServe; }) },
                { name: 'Average player', value: avg_stats.firstServe}
            ]
        },
        {
            key: 'firstPointWon', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.firstPointWon; }) },
                { name: 'Average player', value: avg_stats.firstPointWon}
            ]
        },
        {
            key: 'secPointWon', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.secPointWon; }) },
                { name: 'Average player', value: avg_stats.secPointWon}
            ]
        },
        {
            key: 'break', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.break; }) },
                { name: 'Average player', value: avg_stats.break}
            ]
        },
        {
            key: 'return', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.return; }) },
                { name: 'Average player', value: avg_stats.return}
            ]
        },
        {
            key: 'net', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.net; }) },
                { name: 'Average player', value: avg_stats.net}
            ]
        }
    ]
}

function getPlayerAttributes(player) {
    let player_data = data
        .filter(function (d) {
            if (d.player1 == player.key || d.player2 == player.key) {
                return d
            }
        })
        .map(function (d) {
            if (d.player1 == player.key) {
                return {
                    player: d.player1,
                    won: d.player1 == d.winner,
                    year: d.year,
                    firstServe: d.firstServe1,
                    ace: d.ace1,
                    double: d.double1,
                    firstPointWon: d.firstPointWon1,
                    secPointWon: d.secPointWon1,
                    fastServe: d.fastServe1,
                    avgFirstServe: d.avgFirstServe1,
                    avgSecServe: d.avgSecServe1,
                    break: d.break1,
                    return: d.return1,
                    total: d.total1,
                    winner: d.winner1,
                    error: d.error1,
                    net: d.net1
                };
            } else if (d.player2 == player.key) {
                return {
                    player: d.player2,
                    won: d.player2 == d.winner,
                    year: d.year,
                    firstServe: d.firstServe2,
                    ace: d.ace2,
                    double: d.double2,
                    firstPointWon: d.firstPointWon2,
                    secPointWon: d.secPointWon2,
                    fastServe: d.fastServe2,
                    avgFirstServe: d.avgFirstServe2,
                    avgSecServe: d.avgSecServe2,
                    break: d.break2,
                    return: d.return2,
                    total: d.total2,
                    winner: d.winner2,
                    error: d.error2,
                    net: d.net2
                };
            }
        })

    return player_data;
}

function getAverageStats() {
    return {
        firstServe: Math.ceil( (d3.mean(data, function(d) { return d.firstServe1; }) + d3.mean(data, function(d) { return d.firstServe2; })) / 2),
        ace: Math.ceil( (d3.mean(data, function(d) { return d.ace1; }) + d3.mean(data, function(d) { return d.ace2; })) / 2),
        double: Math.ceil( (d3.mean(data, function(d) { return d.double1; }) + d3.mean(data, function(d) { return d.double2; })) / 2),
        firstPointWon: Math.ceil( (d3.mean(data, function(d) { return d.firstPointWon1; }) + d3.mean(data, function(d) { return d.firstPointWon2; })) / 2),
        secPointWon: Math.ceil( (d3.mean(data, function(d) { return d.secPointWon1; }) + d3.mean(data, function(d) { return d.secPointWon2; })) / 2),
        fastServe: Math.ceil( (d3.mean(data, function(d) { return d.fastServe1; }) + d3.mean(data, function(d) { return d.fastServe2; })) / 2),
        avgFirstServe: Math.ceil( (d3.mean(data, function(d) { return d.avgFirstServe1; }) + d3.mean(data, function(d) { return d.avgFirstServe2; })) / 2),
        avgSecServe: Math.ceil( (d3.mean(data, function(d) { return d.avgSecServe1; }) + d3.mean(data, function(d) { return d.avgSecServe2; })) / 2),
        break: Math.ceil( (d3.mean(data, function(d) { return d.break1; }) + d3.mean(data, function(d) { return d.break2; })) / 2),
        return: Math.ceil( (d3.mean(data, function(d) { return d.return1; }) + d3.mean(data, function(d) { return d.return2; })) / 2),
        total: Math.ceil( (d3.mean(data, function(d) { return d.total1; }) + d3.mean(data, function(d) { return d.total2; })) / 2),
        winner: Math.ceil( (d3.mean(data, function(d) { return d.winner1; }) + d3.mean(data, function(d) { return d.winner2; })) / 2),
        error: Math.ceil( (d3.mean(data, function(d) { return d.error1; }) + d3.mean(data, function(d) { return d.error2; })) / 2),
        net: Math.ceil( (d3.mean(data, function(d) { return d.net1; }) + d3.mean(data, function(d) { return d.net2; })) / 2),
    }
}

function getPlayerAttributesForRadarCompare(player) {
    var player_data = getPlayerAttributes(player);
    return [
        {axis:'firstServe', value: d3.mean(player_data, function(d) { return d.firstServe; }) / 100 },
        {axis:'firstPointWon', value: d3.mean(player_data, function(d) { return d.firstPointWon; }) / 100 },
        {axis:'secPointWon', value: d3.mean(player_data, function(d) { return d.secPointWon; }) / 100 },
        {axis:'break', value: d3.mean(player_data, function(d) { return d.break; }) / 100 },
        {axis:'return', value: d3.mean(player_data, function(d) { return d.return; }) / 100 },
        {axis:'net', value: d3.mean(player_data, function(d) { return d.net; }) / 100 },
    ]
}

function getInterestingStats() {
    let interestingStats = [];
    let obj = {}, obj2;

    // 1. aces and winners
    // sum up aces of each player, sort, get max
    // same for winners
    var players = getAllPlayerNames();
    
    var totalAce = 0, winners = 0
    players.forEach(element => {
        var playerdata = getPlayerAttributes({key: element});
        var totalAcesOfPlayer = d3.sum(playerdata, d => d.ace);
        var totalWinnersOfPlayer = d3.sum(playerdata, d => d.winner);
        if (totalAcesOfPlayer > totalAce) {
            obj = {
                'player': playerdata[0].player,
                'stat': 'Most aces with ' + totalAcesOfPlayer + ' in total'
            }
            totalAce = totalAcesOfPlayer;
        }

        if (totalWinnersOfPlayer > winners) {
            obj2 = {
                'player': playerdata[0].player,
                'stat': 'Most winners with ' + totalWinnersOfPlayer + ' in total'
            }
            winners = totalWinnersOfPlayer;
        }

    });
    interestingStats.push(obj)
    interestingStats.push(obj2)


    // 2. fastest serve
    const fastest = data[d3.maxIndex(data, d => Math.max(d.fastServe1, d.fastServe2))]
    const fastestServePlayer = fastest.fastServe1 > fastest.fastServe2 ? fastest.player1 : fastest.player2;
    const fastestServe = fastest.fastServe1 > fastest.fastServe2 ? fastest.fastServe1 : fastest.fastServe2;
    obj = {
        'player': fastestServePlayer,
        'stat': 'Fastest serve at ' + fastestServe + ' kmph'
    }
    interestingStats.push(obj)
    
    return interestingStats;

}

function getAllPlayerNames() {
    return d3.map(data, function(d){return(d.winner)}).keys()
}