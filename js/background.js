class UnsplashBackgroundApi extends Api {
    'use strict';

    constructor(options) {
        super('/');
        this.options = options;

        this.init = {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Client-ID ' + this.options.key,
                'Content-Type': 'application/json',
                'Accept-Version': 'v1'
            })
        };
    }

    load() {
        const id = Math.floor(Math.random() * 6);
        return this.fetchResources('data/theme_' + id + '.json', this.init).then(response => {
            // Handle the data response
            let imageUrl = response.data.urls.full + '&auto=format&w=' + window.innerWidth + '&h=' + window.innerHeight;
            
            document.getElementById('body').style.backgroundImage = "url('" + imageUrl + "')";
            const imageCredit = (response.data.location.name || response.data.description || response.data.alt_description || 'No description');
            if (imageCredit.length > this.options.imageCreditMaxLength) {
                imageCredit.substring(0, this.options.imageCreditMaxLength - 1) + '...';
            }
            
            const imageCreditContainer = document.getElementById(this.options.imageCreditPanelId);
            imageCreditContainer.innerHTML = '<a href="' + response.data.links.html + '" class="footer__a" target="_blank">' + imageCredit + '</a>';

            // Handle the header response to read the rate limit information
            let rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
            let totalRateLimit = response.headers.get('x-ratelimit-limit');
            console.log('There are ' + rateLimitRemaining + ' requests of ' + totalRateLimit + ' today remaining');
            let rateContainer = document.getElementById(this.options.rateLimitPanelId);
            rateContainer.innerHTML = rateLimitRemaining + '/' + totalRateLimit; 

            return Vibrant.from(imageUrl).getPalette();
        });
    }
}
