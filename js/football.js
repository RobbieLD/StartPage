class Football extends Api {
    constructor(options) {
        super('http://api.football-data.org/');

        this.options = options;
        this.init = {
            method: 'GET',
            headers: new Headers({
                'X-Auth-Token': this.options.key,
                'Content-Type': 'application/json'
            })
        };
    }

    load() {
        this.fetchResources('v2/teams/' + this.options.team + '/matches', this.init).then(response => {
            let finishedMatches = response.data.matches.filter(m => m.status == 'FINISHED');
            let shceduledMatches = response.data.matches.filter(m => m.status == 'SCHEDULED');

            let lastMatch = finishedMatches[finishedMatches.length - 1];
            let nextMatch = shceduledMatches[0];

            let nextMatchElement = document.getElementsByClassName('football__nextfootball')[0];
            let lastMatchElement = document.getElementsByClassName('football__previousfootball')[0];

            nextMatchElement.innerHTML = new Date(nextMatch.utcDate).toLocaleDateString() + ': ' + nextMatch.homeTeam.name + ' vs ' + nextMatch.awayTeam.name;

            let lastMatchAwayScore = ((lastMatch.score.extraTime.awayTeam == null) ? lastMatch.score.fullTime.awayTeam : lastMatch.score.extraTime.awayTeam) + ((lastMatch.score.penalties.awayTeam != null) ? 'p' + lastMatch.score.penalties.awayTeam : '');
            let lastMatchHomeScore = ((lastMatch.score.extraTime.homeTeam == null) ? lastMatch.score.fullTime.homeTeam : lastMatch.score.extraTime.homeTeam) + ((lastMatch.score.penalties.homeTeam != null) ? 'p' + lastMatch.score.penalties.homeTeam : '');

            if (lastMatch.score.winner == 'HOME_TEAM') {
                lastMatchElement.innerHTML = new Date(lastMatch.utcDate).toLocaleDateString() + ': <span class="football__previousfootball--winner">' + lastMatch.homeTeam.name + ' (' + lastMatchHomeScore + ')</span> vs ' + lastMatch.awayTeam.name + ' (' + lastMatchAwayScore + ')';
            } else if (lastMatch.score.winner == 'AWAY_TEAM') {
                lastMatchElement.innerHTML = new Date(lastMatch.utcDate).toLocaleDateString() + ': ' + lastMatch.homeTeam.name + ' (' + lastMatchHomeScore + ') vs <span class="football__previousfootball--winner">' + lastMatch.awayTeam.name + ' (' + lastMatchAwayScore + ')</span>';
            } else {
                lastMatchElement.innerHTML = new Date(lastMatch.utcDate).toLocaleDateString() + ': ' + lastMatch.homeTeam.name + ' (' + lastMatchHomeScore + ') vs ' + lastMatch.awayTeam.name + ' (' + lastMatchAwayScore + ')';
            }
        });
    }
}