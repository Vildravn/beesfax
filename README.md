# Beesfax

A little worker bee tool that datamines [APICO](https://apico.buzz)'s files and outputs files to be used on the [APICO wiki](https://apico.buzz/wiki) 🐝

## Requirements

* NodeJS 14.x

## Usage

1. `git clone https://github.com/Vildravn/beesfax.git` 
1. `cd beesfax`
1. `npm install`
1. `APICO_PATH="~/.steam/steam/SteamApps/common/APICO Demo" node index.js`

Replace the `APICO_PATH` env variable with your path to the APICO install directory. If the variable is left out, the tool will look in its directory for json files instead.

The generated files will be saved in a new directory called `output` created in the tool's directory.