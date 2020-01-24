class Clock {
    'use strict';
    constructor(options) {
        this.options = options;
        this.util = new Util();
    }

    async load() {
        this._setAnimation(this.options.date);
        this._setMonths(this.options.date);
        this._setYear(this.options.date);
        this._setWeek(this.options.date);
        this._setMonthDay(this.options.date);
    }

    _getDaysInMonth(now) {
        return new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }

    _setMonthDay(now) {
        // Set the progress chart
        const monthAngle = (now.getDate() / this._getDaysInMonth(now)) * 360;
        const endArcOuter = this.util.calculatePointOnCircle(monthAngle, 90, 50, 225, 0);
        const endArcInner = this.util.calculatePointOnCircle(monthAngle, 90, 25, 225, 0);
        const progressElement = document.getElementById(this.options.monthProgressElementId);
        const sweepFlag = monthAngle > 180 ? 1 : 0;
        const path = `M 225 -50 A 50 50 0 ${sweepFlag} 1 ${endArcOuter} L ${endArcInner} A 25 25 0 ${sweepFlag} 0 225 -25 z`;
        progressElement.setAttribute('d', path);

        // Set the month number
        const monthNumber = now.getDate();
        const monthNumberElemenent = document.getElementById(this.options.monthNumberElementId);
        monthNumberElemenent.innerHTML = monthNumber.toString().padStart(2, '0');
    }

    _setWeek(now) {
        const days = [...document.getElementsByClassName(this.options.weekClassName)];
        const dx = 35;
        const dy = 18;
        let totalDx = 280;

        days.forEach(day => {
            day.setAttribute('dx', totalDx % 310);
            day.setAttribute('dy', dy);
            totalDx += dx;
        });

        const arrorw = document.getElementById(this.options.weekArrowElementId);
        let dayIndex = now.getDay() - 1;
        dayIndex = dayIndex == -1 ? 6 : dayIndex;
        const dayAngle = 20 + (dayIndex * 40);
        const arrowOffset = 230;
        const arrowBaseTopOffset = 90;
        const arrowBaseBottomOffset = -90;

        const end = this.util.calculatePointOnCircle(dayAngle, arrowOffset, 30, -225, 0);
        const startTop = this.util.calculatePointOnCircle(dayAngle, arrowOffset + arrowBaseTopOffset, 5, -225, 0);
        const startBottom = this.util.calculatePointOnCircle(dayAngle, arrowOffset + arrowBaseBottomOffset, 5, -225, 0);

        const path = `M ${startTop} L ${end} L ${startBottom} z`;

        arrorw.setAttribute('d', path);

        // Set the week number 
        const weekNumber = this._calculateWeekNumber(now).toString().padStart(2, '0');
        const weekNumberElement = document.getElementById(this.options.weekNumberElemenetId);
        weekNumberElement.innerHTML = weekNumber;
    }

    _calculateWeekNumber(now) {
        const date = this._dateserial(this._yearserial(now - this._serial(this._weekday(now - this._serial(1))) + this._serial(4)), 1, 3);
        return ~~((now - date + this._serial(this._weekday(date) + 5)) / this._serial(7));
    }

    _yearserial(date) { 
        return (new Date(date)).getFullYear(); 
    }

    _weekday(date) { 
        return (new Date(date)).getDay() + 1; 
    }

    _dateserial(year, month, day) { 
        return (new Date(year, month - 1, day).valueOf()); 
    }

    _serial(days) { 
        return 86400000 * days; 
    }

    _setAnimation(now) {
        let hourDeg = now.getHours() / 12 * 360 + now.getMinutes() / 60 * 30,
            minuteDeg = now.getMinutes() / 60 * 360 + now.getSeconds() / 60 * 6,
            secondDeg = now.getSeconds() / 60 * 360,
            stylesDeg = [
                "@keyframes rotate-hour{from{transform:rotate(" + hourDeg + "deg);}to{transform:rotate(" + (hourDeg + 360) + "deg);}}",
                "@keyframes rotate-minute{from{transform:rotate(" + minuteDeg + "deg);}to{transform:rotate(" + (minuteDeg + 360) + "deg);}}",
                "@keyframes rotate-second{from{transform:rotate(" + secondDeg + "deg);}to{transform:rotate(" + (secondDeg + 360) + "deg);}}",
            ].join("");

        document.getElementById("clock-animations").innerHTML = stylesDeg;
    }

    _setYear(now) {
        const dayOfYear = this._getDayOfYear(now);
        const yearAngle = (dayOfYear / 366) * 360;
        const radius = 472;
        const startPoint = {
            x: 0,
            y: -1 * radius
        };

        const endpoint = this.util.calculatePointOnCircle(yearAngle, 0, radius, 0, 0);
        const sweepFlag = yearAngle > 180 ? 1 : 0;
        const path = "M " + startPoint.x + " " + startPoint.y + " A " + radius + " " + radius + " 0 " + sweepFlag + " 1 " + endpoint.y + " " + -1 * endpoint.x;
        const progressPath = document.getElementById(this.options.yearProgressElementId);
        progressPath.setAttribute('d', path);
    }

    _setMonths(now) {
        const monthIndex = now.getMonth();
        const months = [...document.getElementsByClassName(this.options.monthElementClassName)];

        const dAngle = 30;
        let angle = -100;

        for (let i = monthIndex; i < months.length; i++) {
            months[i].style.transform = "rotate(" + angle + "deg)";
            angle += dAngle;
        }

        for (let i = 0; i < monthIndex; i++) {
            months[i].style.transform = "rotate(" + angle + "deg)";
            angle += dAngle;
        }
    }

    _getDayOfYear(now) {
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
}