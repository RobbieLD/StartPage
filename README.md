# StartPage

This project was to make a start page for the Chrome browser. It will work in FireFox as well however some of the experimental attributes such as the background blurs won't work at the time of writing. This start page uses a bunch of apis to pull in information about sports, work items and backgrounds and create a nice looking page for displaying that all. It also change its theme according to the background image used. This means there's an infinite amount of themes the page can take on. Currently it's using the unsplash image api to get images to generate themes from but it could be easily mofidied to use any other image source.

## Demo
There is a demo version of this project hosted on github pages hosted [here](https://startpage.robdavis.dev/). This is to demostrate the look and feel of the start page. Because it's not useing most of the real APIs the responses have been mocked. All the panels on the left are mocked, the background and thus the theme are randomly selected from a rotation of six pre prepared ones. The moon phase api is live as it doesn't require any authentication. The weather one is also live (and defaulted to London). It's using a free API key from [openweathermaps.org](https://openweathermap.org/). The sports and panels are all jsut using static HMTL.

## UI Explanation
The UI elements explanation as as follows. 
- **Left Panels**: These can be set to be any kind of panels you want. In my version they pull work items YouTrack and Azure
- **Footer**: Here you'll find information about the current packground and the colours selected from it along with a bunch of other stuff. There is also a button in the bottom left of the footer which hides all other UI but the fotter. This is so you can enjoy the background with out other UI over the top of it.
- **Header**: The left section of the header contains a buton of icon links to my most frequently used web apps. In the top right of the header are several sprots sections filled in by from sports APIs.
- **Clock**: The clock in the right of the page body is the most complex section by far and contains quite a lot of information. 
  - _Sun_: The little yellow sun tracks across the sky showing the sun's current position
  - _Moon_: The moon tracks across the track below the sun showing the current moon position in the sky. This also shows the current moon phase.
  - _Mini Clocks_: The small clocks on the sun and moon tracks show the sun and moon rise and set times. The tool tips for these show the exact times
  - _Wind_: The radr circle in the middle shows an arrow which indicates the wind's current velocity and direction.
  - _Moon Phase_: The center circle also shows the moon phase for when the moon track moon object has already set.
  - _Day of the week_: The day of the week dial shows the current day of the week and also the week number of the year.
  - _Temperature_: The needle to the left of the wind indicator shows the current temperature. The lighter section around the needls shows the level of accuracy expected by the temperature provider. This is usually a range of only a few degrees.
  - _Weather Icon_: The circle at the bottom of the clock shows the current weather icon.
  - _Months_: The months dial around the outside shows the current month (at the top) and the progress through the year as a darker band around the outside.
  - _Pressure_: The current atmospheric pressure is shown on the outer half of the rigth hand dial. 
  - _Humidity_: The current humidity is shown on the inner half on the right hand dial.
  - _Date_: The current date of shown on the right hand circle dial along with the progress though the month as a darker band around the outside. 

## Installation
To use this start page you'll need to pull a copy of the code. It's all basic front end code and doesn't need to be transpiled to work in chrome. You probably will want to configured it some what to your own needs as described in the congifuration section below. I've decided that since this is just a person project for my own use I'm not going to relase a packaged version since for this project to be any use to anyone but me it'll need a little modification. 

To install this extention in Chrome you simply need to go into the extension settings in Chrome and enable developer mode (unless you've packaged it as a ready to ship extension). This allows you to use the 'Load unpacked' extension button and select the folder where you've cloned the code. 


## Configuration
There are two ways to configure the start page to your liking. The first and most obvious way is to simply change the code to match your requriments. This will probably be needed unless you happen to have and use exactly the same requirments as me. It's pretty easy to change the links for example, in the header. The icons come from FontAwesome so you can just change the name and links in the code and it should work. Changing the data that shows in the panels or the sports section will in some cases jsut mean changing api keys or team names in the local storage (more on that later) or implimenting whole new apis. I can't give you much extra information on that other than to say look at the code and follow the existing patterns and it should make sense. 

The config values are all stored in local storage so they can vary from machine to machine. The Chrome dev tools provide a nice interface to these in order to update and manage them. The current values as listed below. Please note that you'll need to create these values (which ever ones you are looking to use) in the local storage when you're ready to test your version of the start page.
- **youtrack_api_key**: This is simply the api key the YouTrack api uses for querying the youtrack issues. 
- **open_weather_api**: This is your api key from [openweathermaps.org](https://openweathermap.org/).
- **azure_user_id**: The azure user ID for the azure api.
- **location**: This is the location (e.g. London) with the weather api uses.
- **azure_api_key**: This is the api for the azure api.
- **football_data_api_key**: The api key for the football api at [football-data.org](https://www.football-data.org/)
- **unsplash_api_key**: This api key for the backgrounds coming from [unsplash.com](https://unsplash.com/developers)
- **football_team_id**: The team id provided the the football data api.
- **unsplash_query**: The query to search for images on the unsplash api. This doesn't need to be specified but it can be useful to keep images to a particular theme such as nature or macro etc. 

Note: If you plan on adding in any new apis you will need to add their base urls to the permissions section on the manifest file so that chrome will grant the extension the permission to call that api. If you change the manifest you need to reload the extension in Chrome. 


