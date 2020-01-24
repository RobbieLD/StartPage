class Soccer extends Api {
    constructor(options) {
        super('https://api.ffa.football/');
        this.options = options;

    }

    load() {
        this.fetchResources('t' + this.options.team + '/fixture').then(result => {
            let upcomming = result.data.filter(m => m.match.status == 'PreMatch').sort(m => m.match.start_date);
            let completed = result.data.filter(m => m.match.status == 'FullTime').sort(m => m.match.start_date)

            let nextMatch = upcomming[0];
            let previousMatch = completed[completed.length - 1];

            let nextMatchContainer = document.getElementsByClassName('soccer__nextsoccer')[0];
            let previousMatchContainer = document.getElementsByClassName('soccer__previoussoccer')[0];

            let previousMatchHomeScore = previousMatch.match.match_info.home_team.score + (previousMatch.match.match_info.home_team.shootout_score ? 'p' + previousMatch.match.match_info.home_team.shootout_score : '');
            let previousMatchAwayScore = previousMatch.match.match_info.away_team.score + (previousMatch.match.match_info.away_team.shootout_score ? 'p' + previousMatch.match.match_info.away_team.shootout_score : '');

            if (previousMatch.match.match_info.home_team.score + previousMatch.match.match_info.home_team.shootout_score > previousMatch.match.match_info.away_team.score + previousMatch.match.match_info.away_team.shootout_score) {
                // Home wins
                previousMatchContainer.innerHTML = new Date(previousMatch.match.start_date).toLocaleDateString() + ': <span class="soccer__previousprevious--winner">' + previousMatch.match.home_team.name + '(' + previousMatchHomeScore + ')</span>' + ' vs ' + previousMatch.match.away_team.name + ' (' + previousMatchAwayScore + ')';
            } else if (previousMatch.match.match_info.home_team.score + previousMatch.match.match_info.home_team.shootout_score < previousMatch.match.match_info.away_team.score + previousMatch.match.match_info.away_team.shootout_score) {
                // Away wins
                previousMatchContainer.innerHTML = new Date(previousMatch.match.start_date).toLocaleDateString() + ': ' + previousMatch.match.home_team.name + '(' + previousMatchHomeScore + ')' + ' vs <span class="soccer__previoussoccer--winner">' + previousMatch.match.away_team.name + ' (' + previousMatchAwayScore + ')</span>';
            } else {
                // Draw
                previousMatchContainer.innerHTML = new Date(previousMatch.match.start_date).toLocaleDateString() + ': ' + previousMatch.match.home_team.name + '(' + previousMatchHomeScore + ')' + ' vs ' + previousMatch.match.away_team.name + ' (' + previousMatchAwayScore + ')';
            }

            nextMatchContainer.innerHTML = new Date(nextMatch.match.start_date).toLocaleDateString() + ': ' + nextMatch.match.home_team.name + ' vs ' + nextMatch.match.away_team.name;
        });
    }
}