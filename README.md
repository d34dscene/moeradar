# Moeradar

Firefox extension to add anime series/movies to sonarr/radarr. It automatically detects type of media and sends it to the correct application.
Click on the extension icon to set the necessary settings. Quality Profiles will pop up after URL and API are set. 

After that you can go to one of these sites, select an anime and press **Alt+Q**, this shortcut will trigger a request and you'll be notified if your request was sent. (Manually changing the shortcut isn't currently supported but will be added in the future)

Currently Supported:
- MyAnimeList
- Anilist
- AniDB
- Kitsu
- AniSearch

#### Notes:
- If your Sonarr/Radarr Application is behind Google Oauth 2.0 for authentication, you need to log into Google once with the correct account and it should work accordingly.
- OVA's can't be requested, you have to request the series and manually add specials in Sonarr. Since most anime specials aren't mapped correctly and won't download at all.
