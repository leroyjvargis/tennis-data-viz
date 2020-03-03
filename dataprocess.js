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
                { name: 'avg', value: avg_stats.firstServe}
            ]
        },
        {
            key: 'firstPointWon', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.firstPointWon; }) },
                { name: 'avg', value: avg_stats.firstPointWon}
            ]
        },
        {
            key: 'secPointWon', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.secPointWon; }) },
                { name: 'avg', value: avg_stats.secPointWon}
            ]
        },
        {
            key: 'break', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.break; }) },
                { name: 'avg', value: avg_stats.break}
            ]
        },
        {
            key: 'return', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.return; }) },
                { name: 'avg', value: avg_stats.return}
            ]
        },
        {
            key: 'net', values: [
                { name: player.key, value: d3.mean(player_data, function(d) { return d.net; }) },
                { name: 'avg', value: avg_stats.net}
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
    let interestingStats;

    // 1. aces
    // sum up aces of each player, sort, get max


    // 2. fastest serve
    max = d3.max(data, function (d) {return d.fastServe1 })
    console.log(max)

    // 3. total winners


}