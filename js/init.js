class Init {
    constructor() {

        // Everything is driven off this date
        const now = new Date();

        // General Settings
        const timeFormat = {
            hour: '2-digit',
            minute: '2-digit'
        };

        // Background
        this.backgroundOptions = {
            rateLimitPanelId: 'rateLimit',
            imageCreditPanelId: 'imageCredit',
            imageCreditMaxLength: 200
        };

        // Weather
        this.weatherOptions = {
            clockId: 'clock',
            // This a free api demo key from openweathermaps.orgs
            key: '17a96bbb428b358618a5b8ebf7b4fa22',
            location: 'London',
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
    }
}