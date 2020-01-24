class YouTrack extends Api {
    constructor(options) {
        super('https://track.calrom.com/');
        this.options = options;

        this.init = {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + this.options.key,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        };

        document.getElementById(this.options.issuesRefreshButtonId).addEventListener('click', (e) => {
            this._loadIssues();
            e.preventDefault = true;
        });
    }

    async _getMyIsues() {
        let results = await this.fetchResources('api/issues?query=for:%20me%20%23Unresolved%20&fields=id,summary,numberInProject,project(id,shortName,iconUrl)', this.init);
        return results.data.map(i => {
            return {
                icon: this.baseUrl + i.project.iconUrl,
                summary: i.summary,
                url: this.baseUrl + 'issue/' + i.project.shortName + '-' + i.numberInProject,
                name: i.project.shortName + '-' + i.numberInProject
            }
        });
    }

    async _loadIssues() {
        let issuesPanel = document.getElementById(this.options.issuesPanelId);
        issuesPanel.innerHTML = '';

        let issues = await  this._getMyIsues();
        

        issues.forEach(i => {
            let issueIcon = document.createElement('img');
            issueIcon.src = i.icon;
            issueIcon.classList.add(this.options.panelIconClassName);

            let issueLink = document.createElement('a');
            issueLink.href = i.url;
            issueLink.innerHTML = i.name + ': ' + (i.summary.length > this.options.maxTitleLength ? i.summary.substring(0, this.options.maxTitleLength - 1) + '...' : i.summary);
            issueLink.target = '_blank';
            issueLink.classList.add(this.options.panelLinkClassName);

            let issuePanel = document.createElement('div');
            issuePanel.classList.add(this.options.panelClassName);
            issuePanel.appendChild(issueIcon);
            issuePanel.appendChild(issueLink);
            issuesPanel.appendChild(issuePanel);
        });
    }
    async load() {
        if (this.options.work == 'true') {
            this._loadIssues();
            this.options.showWorkPanels(this.options.workPanels);
        } else {
            this.options.hideWorkPanels(this.options.workPanels);
        }
    }
}