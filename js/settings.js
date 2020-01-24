class Settings {
    constructor(settingsKeys, options) {
        this.settingsOpen = false;
        this.settingsKeys = settingsKeys;
        this.options = options;
        this.settingsPanel = document.getElementById(this.options.settingsPanelId);

        let viewButton = document.getElementById('viewBtn');
        viewButton.addEventListener('click', (e) => {
            this.toggleView(e.target.parentElement, this.getSetting('work') == "true");
        });

        viewButton.dataset.mode = 'panels';

        // Demo settings
        this.defaultSettings = {
            work: false,
            youtrack_api_key: 'DEMO',
            open_weather_api_key: '',
            azure_user_id: 'DEMO',
            location: 'London',
            azure_api_key: 'DEMO',
            football_data_api_key: 'DEMO',
            unsplash_api_key: '',
            football_team_id: 'DEMO',
            unsplash_query: 'nature'
        }
    }

    toggleView(button, work) {
        if (button.dataset.mode == "panels") {
            button.dataset.mode = 'picture';
            button.innerHTML = '<i class="far fa-image"></i>';
            this.setView(this.options.viewPanels, 'hidden', work);
        } else {
            button.dataset.mode = 'panels';
            button.innerHTML = '<i class="fas fa-image"></i>';
            this.setView(this.options.viewPanels, 'visible', work);
        }
    }

    setView(panels, mode, work) {

        if (work) {
            panels.work.forEach(p => {
                this.sitePanelView(p, mode);
            });
        }

        panels.default.forEach(p => {
            this.sitePanelView(p, mode);
        });
    }

    sitePanelView(p, mode) {
        const element = document.getElementById(p);

        if (element) {
            element.style.visibility = mode;
        }
    }

    showWorkPanels(panels) {
        panels.forEach(p => {
            document.getElementById(p).style.visibility = 'visible';
        });
    }

    hideWorkPanel(panels) {
        panels.forEach(p => {
            document.getElementById(p).style.visibility = 'hidden';
        });
    }

    getSetting(key) {
        const setting = localStorage.getItem(key);

        if (!setting) {
            // add the default setting to the storage
            localStorage.setItem(key, this.defaultSettings[key]);
            return this.defaultSettings[key];
        } else {
            return setting;
        }
    }
}