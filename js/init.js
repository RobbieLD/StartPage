class Init {
    constructor() {

        // Everything is driven off this date
        const now = new Date();

        // Settings
        this.settingKeys = ['unsplash_api_key', 'open_weather_api_key', 'location'];
        this.settingsOptions = {
            settingsPanelId: 'settings',
            settingsPanelOpenClass: 'settings--open',
            settingsPanelClosedClass: 'settings--closed',
            viewPanels: {
                work: ['pullrequestspanel', 'workitemspanel', 'issuespanel'],
                default: ['clock', 'header']
            }
        };

        let settings = new Settings(this.settingKeys, this.settingsOptions);

        // General Settings
        const timeFormat = {
            hour: '2-digit',
            minute: '2-digit'
        };

        // Background
        this.backgroundOptions = {
            rateLimitPanelId: 'rateLimit',
            imageCreditPanelId: 'imageCredit',
            key: settings.getSetting('unsplash_api_key'),
            query: settings.getSetting('unsplash_query'),
            imageCreditMaxLength: 200
        };

        // Weather
        this.weatherOptions = {
            clockId: 'clock',
            key: settings.getSetting('open_weather_api_key'),
            location: settings.getSetting('location'),
            locatonElementId: 'location',
            temperatureUnits: "° C",
            upperTemp: 298.15,
            lowerTemp: 268.15,
            arrowElementId: 'weatherArrow',
            timeFormat: 'en-GB',
            maxMinTempElementId: 'maxmintemp',
            currentTempElementId: 'currenttemp',
            currentTempLabelElementId: 'currentTempLabel',
            humidityArrowElementId: 'himidityArrow',
            pressureArrowElementId: 'pressureArrow',
            humidityInnerRadius: 150,
            humidityOuterRadius: 195,
            pressureInnerRadius: 255,
            pressureOuterRadius: 300,
            iconElementId: 'iconElement',
            arrowBaseDelta: 5,
            humidityLabelElementId: 'humidityLabel',
            pressureLabelElementId: 'pressureLabel'
        };

        // Colours
        this.coloursOptions = {
            swatchPanelId: 'swatches',
            swatchClass: 'swatch',
            swatchElement: 'span'
        };

        // Clock
        this.clockOptions = {
            date: now,
            monthElementClassName: 'clock__months',
            yearProgressElementId: 'yearProgress',
            weekClassName: 'clock__week-number',
            weekArrowElementId: 'weekArrow',
            monthProgressElementId: 'monthProgress',
            monthNumberElementId: 'monthNumber',
            weekNumberElemenetId: 'weekNumber'
        };

        // sun
        this.sunOptions = {
            date: now,
            timeout: 60000,
            sunElementId: 'sun',
            sunGreenTintElementId: 'sunFill',
            sunRiseElementId: 'sunrise',
            sunSetElementId: 'sunset',
            timeFormatOptions: timeFormat
        };

        // Football
        this.footballOptions = {
            key: settings.getSetting('football_data_api_key'),
            team: settings.getSetting('football_team_id')
        };

        // Cricket
        this.cricketOptions = {
            team: '1',
            gender: 'men',
            cricketSeriesElementClassName: 'cricket__cricketseries',
            cricketTeamElementClassName: 'cricket__cricketteams',
            teamName: 'Australia Men',
            apiSection: 'live-upcoming'
        };

        // Soccer
        this.soccerOptions = {
            team: '575'
        };

        // Azure
        this.azureOptions = {
            query: 'My Queries/MyIssues',
            organisation: 'calromltd',
            project: 'InclusiveTour',
            workItemsRefreshButtonId: 'workItemsRefreshBtn',
            pullRequestsRefreshButtonId: 'pullRequestsRefreshBtn',
            workItemsPanelId: 'workitems',
            pullRequestsPanelId: 'pullrequests',
            panelIconClassName: 'panel__icon',
            panelIconChildClassName:'panel__icon--child',
            panelClassName: 'panel__item',
            panelLinkClassName: 'panel__link',
            maxTitleLength: 80,
            userId: settings.getSetting('azure_user_id'),
            key: btoa(settings.getSetting('azure_api_key')),
            work: settings.getSetting('work'),
            workPanels: ['workitemspanel', 'pullrequestspanel'],
            hideWorkPanels: settings.hideWorkPanel,
            showWorkPanels: settings.showWorkPanels
        };

        // Youtrack
        this.youtrackOptions = {
            key: settings.getSetting('youtrack_api_key'),
            issuesPanelId: 'issues',
            panelIconClassName: 'panel__icon',
            panelClassName: 'panel__item',
            panelLinkClassName: 'panel__link',
            issuesRefreshButtonId: 'issueRefreshBtn',
            work: settings.getSetting('work'),
            workPanels: ['issuespanel'],
            maxTitleLength: 80,
            hideWorkPanels: settings.hideWorkPanel,
            showWorkPanels: settings.showWorkPanels
        };

        // Moon
        this.moonOptions = {
            date: now,
            timeout: 60000,
            numberOfDays: 2,
            lunaPhaseShadowElementId: 'lunaPhase',
            moonRadius: 150,
            moonElementId: 'moonGroup',
            moonShadowElementId: 'moonShadow',
            moonRiseElementId: 'moonrise',
            moonSetElementId: 'moonset',
            timeFormatOptions: timeFormat
        };
    }

    _work() {
        new Azure(this.azureOptions).load();
        new YouTrack(this.youtrackOptions).load();
    }

    _sport() {
        new Football(this.footballOptions).load();
        new Cricket(this.cricketOptions).load();
        new Soccer(this.soccerOptions).load();
    }

    _theme() {
        let background = new UnsplashBackgroundApi(this.backgroundOptions);
        let backgroundPromise = background.load();

        let weather = new WeatherApi(this.weatherOptions);
        let weatherPromise = weather.load();

        new Colours(this.coloursOptions).load(backgroundPromise);

        new MoonApi(this.moonOptions).load(weatherPromise);

        new Sun(this.sunOptions).load(weatherPromise);

        return new Clock(this.clockOptions).load();
    }

    go() {
        this._theme();
        this._sport();
        this._work();
    }
}