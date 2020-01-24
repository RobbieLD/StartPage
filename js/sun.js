class Sun {
    constructor(options) {
        this.options = options;
    }

    async load(weather) {
        const weatherResult = await weather;
        this._setSunPosition(weatherResult.sun, this.options.date);
        this._setRiseAndSetTimes(weatherResult.sun);
    }

    _setSunPosition(sun, now) {
        const sunElement = document.getElementById(this.options.sunElementId);
        const sunGreenTint = document.getElementById(this.options.sunGreenTintElementId).children[0];

        const radius = 250;
        let angle = 0;
        const greenMax = 240;
        const greenMin = 50;

        const lengthOfDay = sun.sunset - sun.sunrise;
        if (now >= sun.sunrise && now <= sun.sunset) {
            // day time
            angle = ((now - sun.sunrise) / lengthOfDay) * 180;
        } else {
            // night time - just hide it
            angle = 270
        }

        // Calculate the position
        const radians = (angle - 180) * (Math.PI / 180);
        const xPos = Math.round(Math.cos(radians) * radius);
        const yPos = Math.round(Math.sin(radians) * radius);

        // Set the position
        sunElement.setAttribute('cx', xPos);
        sunElement.setAttribute('cy', yPos);

        // Calculate the green tint based on xPos
        const greenTinitRatio = Math.abs(xPos / radius);
        const greenTinitValue = greenMax - Math.round((greenMax - greenMin) * greenTinitRatio);

        // Set the green tint
        const colours = sunGreenTint.getAttribute('stop-color').split(',');
        sunGreenTint.setAttribute('stop-color', colours[0] + ',' + greenTinitValue + ',' + colours[2] + ',' + colours[2]);

        setTimeout(() => {
            this._setSunPosition(sun, new Date(now.getTime() + this.options.timeout));
        }, this.options.timeout);
    }

    _setRiseAndSetTimes(sun) {
        const sunrise = new ClockIcon(this.options.sunRiseElementId, this.options);
        const sunset = new ClockIcon(this.options.sunSetElementId, this.options);

        sunrise.setTime(sun.sunrise);
        sunset.setTime(sun.sunset);
    }
}