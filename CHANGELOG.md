# Changelog

## 2.0.0-RC1
### Changes
* Add slash commands for most commands
### Bugfix
* Fix `jita` command to now properly reset regions before checking

## 1.2.0
### Changes
* Added `jita` command to find routes between Jita and a region

## 1.1.2
### Bugfix
* Fixed formatting for `route` response due to too long region names

## 1.1.1
### Changes
* Added `route` command to find routes between 2 regions

## 1.1.0
### Bugfix
* Fixed problems resulting out of the deactivation of the `/search/` endpoint by CCP
  * Removed all usages of the `/search/` endpoint
  * Permanently disabled `LoadDataFromGoogle` command as it relies to heavily on the `/search/` endpoint

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