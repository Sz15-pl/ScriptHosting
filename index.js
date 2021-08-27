const express = require('express')
const Database = require('easy-json-database');
const db = new Database('./databases/env.json')
var bodyParser = require('body-parser')
var path = require('path')
const app = express()
app.use(bodyParser.json({limit: '2mb'} ));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   
	limit: '2mb',
  extended: true
})); 
const { uuid } = require('uuid');
const dotenv = require('dotenv')
.config({ path: __dirname + '/env/.env' })
 
const crypto = require("crypto");

function encrypt(plainText, key, outputEncoding = "base64") {
    const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(outputEncoding);
}

function decrypt(cipherText, key, outputEncoding = "utf8") {
    const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
    return Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(outputEncoding);
}




const key = process.env.KEY


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  })
  app.post('/paste', (req, res) => {
    var text = req.body.text
    if(!text){
        res.sendFile(__dirname + '/errors/notext.html')
    } else  if (text) {
        try {
enctext = encrypt(text, key, "base64");
var id = uuid()
db.set(id,enctext)
        } catch (err) {
res.send(err)
        } finally {
            res.redirect("https://scripthosting.herokuapp.com/s?id=" + id)
        }
    }
  })
  app.get('/s', (req, res) => {
    var id = req.query.id
		if(!id){
			res.end();

		} else if (id){
			try{
      var encryptedtext = db.get(id)
			env = decrypt(Buffer.from(encryptedtext, "base64"), key, "utf8")
			
			} catch(err){
				res.send(err)
			} finally {
				res.send(env)
			}
		}
  })

  app.listen(3000, () => {
    console.log(``)
  })
