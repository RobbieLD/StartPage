class Calendar extends Api {
    constructor(options) {
        super('https://clients6.google.com/');

        this.init = {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'SAPISIDHASH 1574687390_c45e254cc81f37a9340d372064224a5e880acc56'
            })
        };

        this.options = options;
    }

    async load() {

        //
        let result = await this.fetchResources('calendar/v3/calendars/robert.lyndon.davis@gmail.com/events?calendarId=robert.lyndon.davis%40gmail.com&singleEvents=true&timeZone=Europe%2FLondon&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=2019-10-27T00%3A00%3A00Z&timeMax=2019-12-01T00%3A00%3A00Z&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs', this.init);

        console.log(result);
    }
}