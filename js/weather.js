class WeatherApi extends Api {
    'use strict';
    constructor(options) {
        super('https://api.openweathermap.org/');
        this.options = options;
        this.util = new Util();
    }

    async load() {
        let response = await this.fetchResources('data/2.5/weather?q=' + this.options.location + '&appid=' + this.options.key);
        
        const weatherLocation = document.getElementById(this.options.locatonElementId);
        weatherLocation.innerHTML = 'Location: ' + this.options.location;
        const kelvin = 273.15;

        const weatherResult = {
            icon: {
                url: 'http://openweathermap.org/img/wn/' + response.data.weather[0].icon + '@2x.png',
                description: response.data.weather[0].description 
             },
            pressure: response.data.main.pressure,
            humidity: response.data.main.humidity,
            temperature: {
                current: {
                    raw: response.data.main.temp,
                    formatted: Math.round(response.data.main.temp - kelvin) + this.options.temperatureUnits
                },
                max: {
                    raw: response.data.main.temp_max,
                    formatted: Math.round(response.data.main.temp_max - kelvin) + this.options.temperatureUnits
                },
                min: {
                    raw: response.data.main.temp_min,
                    formatted: Math.round(response.data.main.temp_min - kelvin) + this.options.temperatureUnits
                },
                upper: {
                    raw: this.options.upperTemp,
                    formatted: Math.round(this.options.upperTemp - kelvin) + this.options.temperatureUnits,
                    range: response.data.main.temp_max - this.options.lowerTemp
                },
                lower: {
                    raw: this.options.lowerTemp,
                    formatted: Math.round(this.options.lowerTemp - kelvin) + this.options.temperatureUnits,
                    range: response.data.main.temp_min - this.options.lowerTemp
                },
                range: this.options.upperTemp - this.options.lowerTemp
            },
            wind: {
                direction: response.data.wind.deg,
                speed: response.data.wind.speed
            },
            sun: {
                sunset: new Date(response.data.sys.sunset * 1000),
                sunrise: new Date(response.data.sys.sunrise * 1000)
            },
            location: {
                lat: response.data.coord.lat,
                lon: response.data.coord.lon
            }
        }

        this._drawWeatherArrow(weatherResult.wind);
        this._setTemperature(weatherResult.temperature);
        this._drawHumidityArrow(weatherResult.humidity);
        this._drawPressureArrow(weatherResult.pressure);
        this._setIcon(weatherResult.icon);

        return weatherResult;
    }

    _setIcon(icon) {
        const iconElement = document.getElementById(this.options.iconElementId);
        iconElement.setAttribute('href', icon.url);
        const parent = iconElement.parentElement.getElementsByTagName('title')[0];
        parent.innerHTML = icon.description;
    }

    _drawPressureArrow(pressure) {
        const pressureArrowElement = document.getElementById(this.options.pressureArrowElementId);

        const pressureAngle = 90 - (((pressure - 950) / 100) * 90) + 5;
        
        const start = this.util.calculatePointOnCircle(pressureAngle, 0, this.options.pressureInnerRadius, 0, 0);
        
        const endTop = this.util.calculatePointOnCircle(pressureAngle + this.options.arrowBaseDelta / 2, 0, this.options.pressureOuterRadius, 0, 0);
        const endBottom = this.util.calculatePointOnCircle(pressureAngle - this.options.arrowBaseDelta / 2, 0, this.options.pressureOuterRadius, 0, 0);

        const path = `M ${endBottom} L ${start} L ${endTop} z`;
        pressureArrowElement.setAttribute("d", path);

        const pressureLabel = document.getElementById(this.options.pressureLabelElementId);
        pressureLabel.firstElementChild.firstElementChild.innerHTML = pressure + "kPa";
    }

    _drawHumidityArrow(humidity) {
        const humidityArrowElement = document.getElementById(this.options.humidityArrowElementId);

        const humidityAngle = 90 - ((humidity / 100) * 90) + 5;
        
        const startBottom = this.util.calculatePointOnCircle(humidityAngle + this.options.arrowBaseDelta, 0, this.options.humidityInnerRadius, 0, 0);
        const startTop = this.util.calculatePointOnCircle(humidityAngle - this.options.arrowBaseDelta, 0, this.options.humidityInnerRadius, 0, 0);
        const end = this.util.calculatePointOnCircle(humidityAngle, 0, this.options.humidityOuterRadius, 0, 0);
        
        const path = `M ${startBottom} L ${end} L ${startTop} z`;
        humidityArrowElement.setAttribute("d", path);

        const humidityLabel = document.getElementById(this.options.humidityLabelElementId);
        humidityLabel.firstElementChild.firstElementChild.innerHTML = humidity + "%";
    }

    _drawWeatherArrow(wind) {
        const maxWind = 6;
        const radarRadious = 150;
        wind.speed = Math.log2(wind.speed);
        wind.direction = wind.direction + 90 || 0;

        let windRadians = wind.direction * (Math.PI / 180);

        let xRatio = Math.cos(windRadians);
        let yRatio = Math.sin(windRadians);

        let xPos = (wind.speed / maxWind) * xRatio * radarRadious;
        let yPos = (wind.speed / maxWind) * yRatio * radarRadious;

        let arrow = document.getElementById(this.options.arrowElementId);
        arrow.setAttribute('x2', xPos);
        arrow.setAttribute('y2', yPos);

        arrow.getElementsByTagName('title')[0].innerHTML = 'Direction: ' + wind.direction + '°, Speed: ' + Math.round(wind.speed) + 'm/s';
    }

    _setTemperature(temperature) {
        const offset = 270;
        const needleOffset = 30;
        const outerRadius = 300;
        const innerRadius = 150;
        const dailyMaxAngle = 90 * (temperature.upper.range / temperature.range);
        const dailyMinAngle = 90 * (temperature.lower.range / temperature.range);

        const dailyMaxOuter = this.util.calculatePointOnCircle(dailyMaxAngle, offset, outerRadius, 0, 0);
        const dailyMaxInner = this.util.calculatePointOnCircle(dailyMaxAngle, offset, innerRadius, 0, 0);
        const dailyMinOuter = this.util.calculatePointOnCircle(dailyMinAngle, offset, outerRadius, 0, 0);
        const dailyMinInner = this.util.calculatePointOnCircle(dailyMinAngle, offset, innerRadius, 0, 0);

        const path = `M ${dailyMaxInner} A ${innerRadius} ${innerRadius} 0 0 0 ${dailyMinInner} L ${dailyMinOuter} A ${outerRadius} ${outerRadius} 0 0 1 ${dailyMaxOuter} z`;

        document.getElementById(this.options.maxMinTempElementId).setAttribute('d', path);

        // Set the current temp
        const currentAngle = 90 * (temperature.current.raw - temperature.lower.raw) / temperature.range;
        const currentInner = this.util.calculatePointOnCircle(currentAngle, offset, innerRadius, 0, 0);
        const currentOuter = this.util.calculatePointOnCircle(currentAngle, offset, outerRadius - needleOffset, 0, 0);

        const currentLine = document.getElementById(this.options.currentTempElementId);
        currentLine.setAttribute('x1', currentOuter.x);
        currentLine.setAttribute('y1', currentOuter.y);
        currentLine.setAttribute('x2', currentInner.x);
        currentLine.setAttribute('y2', currentInner.y);

        const currentTempLabel = document.getElementById(this.options.currentTempLabelElementId);
        currentTempLabel.innerHTML = temperature.current.formatted;

        currentTempLabel.setAttribute('transform','rotate(' + (currentAngle + offset + 1) + ') translate(-290, -10) rotate(90)');
    }

}