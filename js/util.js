class Util {
    calculatePointOnCircle(degrees, offset, radius, transX, transY) {
        const radians = this.degToRad(degrees, offset);
        let result = {
            x: (Math.cos(radians) * radius) + transX,
            y: (Math.sin(radians) * radius) + transY
        };
        result.toString = () => {
            return result.x + ' ' + result.y;
        };
        return result;
    }

    degToRad(deg, offset) {
        return (deg - offset) * (Math.PI / 180);
    }
}