var Q = require('q');
var fs = require('fs');
var pdf = require('html-pdf');

var service = {};

service.buildContact = buildContact;
service.deleteContact = deleteContact;

module.exports = service;


function buildContact(body) {
    var deferred = Q.defer();
    var html = require('pdf_templates/contact.template').getHTML(body);
    var options = {format: 'A4'};

    pdf.create(html, options).toFile('./files/fichecontact/fichecontact_' + body.contact.id_contact + '.pdf', function (err, res) {
        if (err) deferred.reject(error.name + ': ' + error.message);

        deferred.resolve();
    });
    return deferred.promise;
}

function deleteContact(id) {
    var deferred = Q.defer();
    fs.unlink('./files/fichecontact/fichecontact_' + id + '.pdf', function (err) {
        //if(err) deferred.reject(err);

        deferred.resolve();
    });
    return deferred.promise;
}
