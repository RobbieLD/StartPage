class Azure extends Api {
    constructor(options) {
        super('https://dev.azure.com/');
        this.options = options;
        this.init = {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Basic ' + this.options.key,
                'Content-Type': 'application/json',
                'Api-Version': '5.1'
            })
        };

        document.getElementById(this.options.workItemsRefreshButtonId).addEventListener('click', (e) => {
            this._loadWorkItems();
            e.preventDefault = true;
        });

        document.getElementById(this.options.pullRequestsRefreshButtonId).addEventListener('click', (e) => {
            this._loadPullRequests();
            e.preventDefault = true;
        });

    }

    async _getQueryId() {
        let result = await this.fetchResources(this.options.organisation + '/' + this.options.project + '/_apis/wit/queries/' + this.options.query, this.init);
        return result.data.id;
    }

    async _getWorkItem(url, icons, source) {
        let result = await this.fetchResources(url, this.init);
        return {
            title: result.data.fields['System.Title'],
            type: result.data.fields['System.WorkItemType'],
            url: result.data._links.html.href,
            icon: icons[result.data.fields['System.WorkItemType']],
            state: result.data.fields['System.State'],
            isChild: source != null
        }
    }

    async _getQueryWorkItems(queryId) {
        let result = await this.fetchResources(this.options.organisation + '/' + this.options.project + '/_apis/wit/wiql/' + queryId, this.init);
        return result.data.workItemRelations;
    }

    async _getIcons() {
        let result = await this.fetchResources(this.options.organisation + '/' + this.options.project + '/_apis/wit/workitemtypes', this.init);
        let icons = result.data.value.map(i => {
            return {
                type: i.name,
                url: i.icon.url
            }
        });

        let iconsObject = {}
        icons.forEach(i => iconsObject[i.type] = i.url);
        return iconsObject;
    }

    async _loadWorkItems() {
        let workItemsPanel = document.getElementById(this.options.workItemsPanelId);
        workItemsPanel.innerHTML = '';

        let icons = await this._getIcons();
        let queryId = await this._getQueryId();
        let workItemsUrls = await this._getQueryWorkItems(queryId);
        let workItemDetails = await Promise.all(workItemsUrls.map(w => this._getWorkItem(w.target.url.split('dev.azure.com')[1], icons, w.source)));

        // Populate the work items ui
        workItemDetails.forEach(w => {
            let workItemIcon = document.createElement('img');
            workItemIcon.src = w.icon;
            workItemIcon.classList.add(this.options.panelIconClassName);

            let suffix = w.state.replace(' ', '-');
            suffix = suffix.toLowerCase();

            let statusClass = this.options.panelIconClassName + "--" + suffix

            workItemIcon.classList.add(statusClass);

            if (w.isChild) {
                workItemIcon.classList.add(this.options.panelIconChildClassName);
            }

            let workItemLink = document.createElement('a');
            workItemLink.href = w.url;
            workItemLink.innerHTML = w.title.length > this.options.maxTitleLength ? w.title.substring(0, this.options.maxTitleLength - 1) + '...' : w.title;
            workItemLink.target = '_blank';
            workItemLink.classList.add(this.options.panelLinkClassName);

            let workItemPanel = document.createElement('div');
            workItemPanel.classList.add(this.options.panelClassName);
            workItemPanel.appendChild(workItemIcon);
            workItemPanel.appendChild(workItemLink);
            workItemsPanel.appendChild(workItemPanel);
        });
    }

    async _getPullRequests(repositoryId) {
        let result = await this.fetchResources(this.options.organisation + '/' + this.options.project + '/_apis/git/repositories/' + repositoryId + '/pullrequests?searchCriteria.creatorId=' + this.options.userId, this.init);
        return result.data.value;
    }

    async _getRepositories() {
        let result = await this.fetchResources(this.options.organisation + '/' + this.options.project + '/_apis/git/repositories', this.init);
        return result.data.value;
    }

    async _loadPullRequests() {
        let pullRequestsPanel = document.getElementById(this.options.pullRequestsPanelId);
        pullRequestsPanel.innerHTML = '';

        let repositories = await this._getRepositories();
        let pullRequests = await this._getPullRequests(repositories[0].id);

        pullRequests.forEach(p => {
            let pullRequestLink = document.createElement('a');
            pullRequestLink.href = p.url;
            pullRequestLink.innerHTML = p.title.length > this.options.maxTitleLength ? p.title.substring(0, this.options.maxTitleLength - 1) + '...' : p.title;
            pullRequestLink.target = '_blank';
            pullRequestLink.classList.add(this.options.panelLinkClassName);

            let pullRequestStatus = document.createElement('span');
            pullRequestStatus.innerHTML = p.status + ' ';
            pullRequestStatus.classList.add(this.options.panelStatusClassName);

            let pullRequestPanel = document.createElement('div');
            pullRequestPanel.classList.add(this.options.panelClassName);
            pullRequestPanel.appendChild(pullRequestStatus);
            pullRequestPanel.appendChild(pullRequestLink);
            pullRequestsPanel.appendChild(pullRequestPanel);
        });
    }

    async load() {
        if (this.options.work == 'true') {
            this._loadWorkItems();
            this._loadPullRequests();
            this.options.showWorkPanels(this.options.workPanels);
        } else {
            this.options.hideWorkPanels(this.options.workPanels);
        }
    }
}