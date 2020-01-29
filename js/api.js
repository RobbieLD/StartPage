class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async fetchResources(resourcePath, headers, isText) {
        Api.apiCount++;
        const startTime = new Date();
        const response = await fetch(this.baseUrl + resourcePath, headers);
        let data;
        if (isText) {
            data = await response.text();
        } else {
            data = await response.json();
        }
        // Update the api status
        const endTime = new Date();
        Api.apiTime =+ (endTime - startTime);
        Api.apiStats += this.constructor.name + ': ' + (endTime - startTime) + 'ms\n';
        
        const statsElement = document.getElementById('apiStats');
        statsElement.innerHTML = 'Api Calls: ' + Api.apiCount + ' (' + Api.apiTime + 'ms)';
        statsElement.setAttribute('title', Api.apiStats);

        return {
            data: data,
            headers: response.headers
        }
    }
}

Api.apiCount = 0;
Api.apiTime = 0;
Api.apiStats = '';