import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Palaute-data REST-apia varten
import feedback from './feedback_mock.json' with { type: 'json' };
import { clear } from 'console';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const host = 'localhost';
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));


app.use(express.json())

app.use(express.urlencoded({ extended: true }));

// apufunktios
const newId = () => {
    let max = 0;
    
    for (let palaute of feedback) {
        if (palaute.id > max) {
            max = palaute.id;
        }
    }
    
    return max + 1;
}

// Polkumäärittelyt ejs-sivupohjia käyttäville web-sivuille
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/palautelomake', (req, res) => {
    res.render('palaute');
});
app.post('/palautelomake', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let feedback = req.body.feedback;

    fs.readFile('data.json', 'utf8', function (err, dataString) {
        if (err) {
            console.log('ERR: Palaute-datan lukeminen epäonnistui');
        }
        else {
            let data = [];
            try {
                data = JSON.parse(dataString);
                if (!Array.isArray(data)) {
                    data = [];
                    throw new TypeError('Data not an array');
                }
            } catch (error) {
                console.log('ERR: Palaute-datan lukeminen epäonnistui');
                console.log(error);
            }

            data.push({
                name: name,
                email: email,
                feedback: feedback
            });
        
            fs.writeFile('data.json', JSON.stringify(data), { encoding: 'utf8' }, (err) => {
                if (err) {
                    console.log('ERR: Palaute-datan tallettaminen epäonnistui');
                }
                else {
                    console.log('OK:  Palaute-datan tallettaminen onnistui');
                }
            });
        
            res.render('vastaus', { name: name, email: email });
        }
    });
});

// REST-palvelimen polut
app.get('/palaute/', (req, res) => {
    // Palauttaa kaikki palautteet
    res.json(feedback);
});
app.get('/palaute/:id', (req, res) => {
    const haettu = req.params.id;
    const tulos = feedback.filter((palaute) => palaute.id == haettu);
    res.json(tulos);
});
app.post('/palaute/uusi', (req, res) => {
    const nimi = req.body.name
    const email = read.body.email
    const palaute = req.body.feedback

    if (!nimi || !email || !palaute) {
        res.status(400);    
        res.send('Virhe osa tiedoista puuttuu');
    }

    const uusi = {
        id: newId(),
        name: nimi,
        email: email,
        feedback: palaute,
    }

    feedback.push(uusi);

    res.status(200).json(uusi);
});
app.put('/palaute/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);

    const nimi = req.body.name;
    const email = req.body.email;
    const palaute = req.body.feedback;

    if (!nimi || !email || !palaute) {
        res.status(400);
        res.send('Virhe: osa tiedoista puuttuu')
        return;
    }

    let onOlemassa = false;
    let uusi = {};

    for (let yksi of feedback) {
        if (yksi == id) {
            yksi.name = nimi;
            yksi.email = email;
            yksi.feedback = palaute;

            onOlemassa = true;
            uusi = yksi;
        }
    }

    if (!onOlemassa) {
        res.status(400).send('Virhe: Tuntematon ID');
        return;
    }

    res.json(uusi);
});
app.delete('/palaute/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);

    let onOlemassa = false;

    for (let i = 0; i < feedback.length; i++) {
        if (feedback[i].id == id) {
            onOlemassa = true;
            feedback.splice(i, 1);

            i--;
        }
    }

    if (!onOlemassa) {
        res.status(400).send('Virhe: Tuntematon ID')
    }
    else {
        res.send('OK, poistettu');
    }

});

// Aina viimeisenä palvelimen käynnistys
app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));