# Changelog

## 1.0.3
### Bugfix
* Show command now correctly merges search phrases to search for complex region names
* debug script no longer runs in develop mode by default (revert from 1.0.2)
* Fixed a breaking response from git when no tag was found

## 1.0.2
### Changes
* Update discord.js from 12.5 to 13.1
* Add `changelog` command
* Improve .env file
* Improve logging for easier access and understanding
* Bot now listens to group mention to prevent confusion with default bot group
* debug script now runs by default in develop mode
### Bugfix
* JoveStorage no longer loads its own env variables

## 1.0.1
### Changes
* Pathfinder load command is now admin only

## 1.0.0
### Changes
* Release starting at the introduction of the `pfload` command