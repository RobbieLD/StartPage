class Colours {
    constructor(options) {
        this.options = options;
    }

    async load(colours) {
        let pallet = await colours;
        this._updateColours(pallet);
        this._buildSwatches(pallet);
    }

    _buildSwatches(swatches) {
        let swatchContainer = document.getElementById(this.options.swatchPanelId);
        swatchContainer.innerHTML = '';

        for (let swatch in swatches) {
            if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {

                let swatchElement = document.createElement(this.options.swatchElement);
                swatchElement.classList.add(this.options.swatchClass);
                swatchElement.style.background = swatches[swatch].getHex();
                swatchElement.title = swatch;
                swatchContainer.appendChild(swatchElement);
            }
        }
    }

    _updateColours(swatches) {
        for (let swatch in swatches) {

            if (swatches[swatch] == null)
                continue;

            let elements = document.getElementsByClassName(swatch.toLowerCase());

            Array.from(elements).forEach(element => {
                let swatchAttribute = element.dataset.swatch;
                let originalColour = getComputedStyle(element)[swatchAttribute];
                let alphaArray = originalColour.match(/0\.\d/);
                let alpha = alphaArray ? alphaArray[0] : '1';
                let newColour = swatches[swatch].getRgb();
                let newColourWithAlpha = 'rgba(' + newColour[0] + ',' + newColour[1] + ', ' + newColour[2] + ',' + alpha + ')';
                element.style[swatchAttribute] = newColourWithAlpha;
            });
        }
    }
}