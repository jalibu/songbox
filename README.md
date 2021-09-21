# Songbox
[![version](https://img.shields.io/github/package-json/v/jalibu/songbox)](https://github.com/jalibu/songbox/releases) [![dependencies Status](https://status.david-dm.org/gh/jalibu/songbox.svg)](https://david-dm.org/jalibu/songbox) [![Known Vulnerabilities](https://snyk.io/test/github/jalibu/songbox/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jalibu/songbox?targetFile=package.json)

Liederbuch Zuhause liegen lassen? Dein neues Lieblingslied fehlt dir? Das Pfadi Lieder-Kiosk hilft.  
Das Lieder-Kiosk ist eine offline Lieder-Datenbank mit schickem, responsivem Web-Frontend.  
Es läuft problemlos auf einem Rasperry Pi Zero und kann Liedtexte an einen angeschlossenen Thermo-Drucker schicken.  

<img src="https://user-images.githubusercontent.com/25933231/134173972-fa757bdd-5bdd-4af7-b95f-8c91b19b2bc1.png" alt="drawing" width="600px"/>
<img src="https://user-images.githubusercontent.com/25933231/134174147-cd03b831-f635-4024-b852-449a30fcbe4a.png" alt="drawing" width="400px"/>
<img src="https://user-images.githubusercontent.com/25933231/134176573-93c340f7-a0a0-4b88-9844-9ce00c72553d.png" alt="drawing" width="400px"/>


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Update Song Database
```bash
# Decode database
$ npm run db-decode

# Make changes in data/songs_decoded.xml

# Encode database
$ npm run db-encode
```

## License

[MIT licensed](LICENSE).
