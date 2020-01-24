class ClockIcon {
    constructor(id, options) {
        this.id = id;
        this.options = options;
    }

    setTime(time) {
        const group = document.getElementById(this.id);
        const title = group.getElementsByTagName('title')[0];
        const hour = group.getElementsByClassName('hour')[0];
        const minute = group.getElementsByClassName('minute')[0];

        const hourAngle = ((time.getHours() % 12) / 12) * 360;
        const minuteAngle = (time.getMinutes() / 60 ) * 360;

        hour.style.transform = 'rotate(' + hourAngle + 'deg)';
        minute.style.transform = 'rotate(' + minuteAngle + 'deg)';

        title.innerHTML = time.toGMTString();
    }
}