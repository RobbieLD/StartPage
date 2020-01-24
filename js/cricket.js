class Cricket extends Api {
    constructor(options) {
        super('https://www.cricket.com.au/');
        this.options = options;
    }

    async load() {
        const results = await this.fetchResources('cricketcomau/series/RequestFixtures?seriesId=&teamName=' + this.options.team + '&location=&gender=' + this.options.gender + '&skip=999', null, true);
        const matches = this._parseHtml('<html><body>' + results.data + '</body></html>');
        this._updateUI(matches[0]);
    }

    _updateUI(match) {
        let seriesContainer = document.getElementsByClassName(this.options.cricketSeriesElementClassName)[0];
        let teamsContainer = document.getElementsByClassName(this.options.cricketTeamElementClassName)[0];

        seriesContainer.innerHTML = match.details;
        teamsContainer.innerHTML = match.date.toLocaleDateString() + ': ' + match.opposition
    }

    _parseHtml(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const live = doc.getElementById(this.options.apiSection);
        const rows = [];

        [...live.children].forEach(e => {
            if (e.classList.contains('row')) {
                rows.push(e);
            }
        });

        let matches = [];
        rows.forEach(row => {
            const date = new Date(row.getElementsByClassName('match-date')[0].innerHTML);
            const opposition = [...row.getElementsByClassName('team-name')].filter(e => e.innerHTML != this.options.teamName)[0].innerHTML;
            const details = row.getElementsByClassName('match-details')[0].firstElementChild.innerText.trim().split('\n')[0];

            const match = {
                date: date,
                opposition: opposition,
                details: details
            };

            matches.push(match);
        });

        return matches.sort(m => m.data);
    }
}