let config = require('../config.js');

export class AppConfig {
    public readonly apiUrl = 'http://' + location.hostname + ':4000';
    public readonly logoPath = 'image/' + config.company + '.png';
}