
var service = {};

service.getHTML = getHTML;

module.exports = service;

function getHTML(body){
    return `
    <html>
    <head>
    <meta charset="utf8">
    <title>SuitArt Business Card</title>
    <style>
    html, body {
        margin: 0;
        padding: 50px;
        font-weight: 500;
        font-size: 15px;
        -webkit-print-color-adjust: exact;
        box-sizing: border-box;
    }
    </style>
    </head>
    <body>
        <h1>Test génération PDF : contact n°`+get(body.contact.id_contact)+`</h1>
        <h2>`+get(body.contact.type)+`</h2>
        <p>
            <strong>Nom :</strong> `+get(body.contact.nom)+` <br />
            <strong>Prénom :</strong> `+get(body.contact.prenom)+` <br />
            <strong>Date de création :</strong> `+get(body.contact.date_entree)+`
        </p>
    </body>
    </html>`;
}

function get(elem){
    return (elem === undefined)? '' : elem;
}
