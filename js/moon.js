class MoonApi extends Api {
    constructor(options) {
        super('https://moonphases.co.uk/');
        this.options = options;
    }

    async load(weather) {
        const weatherResult = await weather;

        let yesterday = new Date(this.options.date.getTime());
        yesterday = new Date(yesterday.setDate(this.options.date.getDate() - 1));

        const month = parseInt(yesterday.getMonth()) + 1;
        const result = await this.fetchResources('service/getMoonDetails.php?day=' + yesterday.getDate() + '&month=' + month + '&year=' + yesterday.getFullYear() + '&lat=' + weatherResult.location.lat + '&lng=' + weatherResult.location.lon + '&len=' + this.options.numberOfDays);
        const moonToday = result.data.days[1];
        const moonYesterday = result.data.days[0];

        const moon = {
            tilt: moonToday.tilt,
            illumination: moonToday.illumination,
            yesterdaymoonrise: new Date(moonYesterday.moonrise),
            yesterdaymoonset: new Date(moonYesterday.moonset),
            moonrise: new Date(moonToday.moonrise),
            moonset: new Date(moonToday.moonset),
            nextmoonrise: new Date(result.data.next_moonrise),
            nextmoonset: new Date(result.data.next_moonset),
            waxing: moonToday.stage == 'Waxing' ? 1 : 0,
            description: moonToday.phase_name + ': ' + moonToday.stage
        };

        // The the phase diagram in the middle of the clock
        this._setLunaPhasePosition(moon);

        // The the position and phase of the moon icon
        this._setMoonPosition(moon, this.options.date);

        // Set the moon rise and set times in the clock face
        this._setRiseAndSetTimes(moon, this.options.date);
    }

    _scale(value, rawMin, rawMax, min, max) {
        return (((value - rawMin) * (max - min)) / (rawMax - rawMin)) + min;
    }

    _setMoonPosition(moon, now) {
        const moonElement = document.getElementById(this.options.moonElementId);
        const moonShadowElement = document.getElementById(this.options.moonShadowElementId);

        moonElement.getElementsByTagName('title')[0].innerHTML = moon.description;

        const radius = -180;
        const radiousOfMoonShadow = 18;
        let angle = 0;
        let tilt = moon.tilt;
        let offset = 0;
        let direction = 1;

        if (now > moon.moonrise && now < moon.nextmoonset) {
            // The moon has set today but has also risen today after it set
            const lengthOfDay = moon.nextmoonset - moon.moonrise;
            angle = ((now - moon.moonrise) / lengthOfDay) * 180;
        } else if (now < moon.moonrise && now < moon.moonset) {
            // The moon hasn't set today
            const lengthOfDay = moon.moonset - moon.yesterdaymoonrise;
            angle = ((now - moon.yesterdaymoonrise) / lengthOfDay) * 180;

        } else {
            // The moon is down
            angle = 270;
        }

        if (moon.waxing) {
            if (moon.illumination > 50) {
                offset = this._scale(moon.illumination, 0, 50, 1, 0) * radiousOfMoonShadow;
                direction = 0;
            } else {
                offset = this._scale(moon.illumination, 50, 100, 0, 1) * radiousOfMoonShadow;
                direction = 1;
            }
        } else {
            tilt = 180 - moon.tilt;
            if (moon.illumination > 50) {
                offset = this._scale(moon.illumination, 50, 100, 0, 1) * radiousOfMoonShadow;
                direction = 0;
            } else {
                offset = this._scale(moon.illumination, 0, 50, 1, 0) * radiousOfMoonShadow;
                direction = 1;
            }

        }

        moonElement.setAttribute('transform', 'rotate(' + angle + ') translate(' + radius + ',0) rotate(' + -1 * (angle) + ') rotate(' + tilt + ')');
        const path = 'M -40 18 L -40 -18 L 0 -18 A ' + offset + ' 18 0 0 ' + direction + ' 0 18 z';
        moonShadowElement.setAttribute('d', path);

        setTimeout(() => {
            this._setMoonPosition(moon, new Date(now.getTime() + this.options.timeout));
        }, this.options.timeout);
    }

    _setRiseAndSetTimes(moon, now) {
        const moonrise = new ClockIcon(this.options.moonRiseElementId, this.options);
        const moonset = new ClockIcon(this.options.moonSetElementId, this.options);

        if (now > moon.moonrise && now < moon.nextmoonset) {
            moonrise.setTime(moon.moonrise);
            moonset.setTime(moon.nextmoonset);
        } else if (now < moon.moonrise && now < moon.moonset) {
            moonrise.setTime(moon.yesterdaymoonrise);
            moonset.setTime(moon.moonset);

        } else {
            moonrise.setTime(moon.moonrise);
            moonset.setTime(moon.moonset);
        }
    }

    _setLunaPhasePosition(moon) {
        let offset = 0;
        let direction = 1;
        let angle = moon.tilt;

        if (moon.waxing) {
            if (moon.illumination > 50) {
                offset = this._scale(moon.illumination, 0, 50, 1, 0) * this.options.moonRadius;
                direction = 0;
            } else {
                offset = this._scale(moon.illumination, 50, 100, 0, 1) * this.options.moonRadius;
                direction = 1;
            }
        } else {
            angle = 180 - moon.tilt;
            if (moon.illumination > 50) {
                offset = this._scale(moon.illumination, 50, 100, 0, 1) * this.options.moonRadius;
                direction = 0;
            } else {
                offset = this._scale(moon.illumination, 0, 50, 1, 0) * this.options.moonRadius;
                direction = 1;
            }

        }
        const path = "M -300 -150 L 0 -150 A " + offset + " 150 0 0 " + direction + " 0 150 L -300 150 z";
        let lunaShadow = document.getElementById(this.options.lunaPhaseShadowElementId);
        lunaShadow.setAttribute('transform', 'rotate(' + angle + ', 0, 0)');
        lunaShadow.setAttribute('d', path);
    }
}