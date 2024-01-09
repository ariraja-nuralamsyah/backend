var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM sensor_data ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('sensor_data', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('sensor_data/index', {
                data: rows // <-- data posts
            });
        }
    });
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('sensor_data/create', {
        temperature: '',
        humidity: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {
    
    let temperature   = req.body.temperature;
    let humidity = req.body.humidity;
    let errors  = false;

    if(temperature.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan temperature");
        // render to add.ejs with flash message
        res.render('sensor_data/create', {
            temperature: temperature,
            humidity: humidity
        })
    }

    if(humidity.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan humidity");
        // render to add.ejs with flash message
        res.render('sensor_data/create', {
            temperature: temperature,
            humidity: humidity
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            temperature: temperature,
            humidity: humidity
        }
        
        // insert query
        connection.query('INSERT INTO sensor_data SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('sensor_data/create', {
                    temperature: formData.temperature,
                    humidity: formData.humidity  
                })
            } else {                
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/sensor_data');
            }
        })
    }

})

/**
 * EDIT POST
 */
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM sensor_data WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data sensor Dengan ID ' + id + " Tidak Ditemukan")
            res.redirect('/sensor_data')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('sensor_data/edit', {
                id:      rows[0].id,
                temperature:   rows[0].temperature,
                humidity: rows[0].humidity
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {

    let id      = req.params.id;
    let temperature   = req.body.temperature;
    let humidity = req.body.humidity;
    let errors  = false;

    if(temperature.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan temperature");
        // render to edit.ejs with flash message
        res.render('sensor_data/edit', {
            id:         req.params.id,
            temperature:      temperature,
            humidity:    humidity
        })
    }

    if(humidity.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan temperature");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id:         req.params.id,
            temperature:      temperature,
            humidity:    humidity
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            temperature: temperature,
            humidity: humidity
        }

        // update query
        connection.query('UPDATE sensor_data SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('sensor_data/edit', {
                    id:     req.params.id,
                    temperature:   formData.temperature,
                    humidity: formData.humidity
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/sensor_data');
            }
        })
    }
})

/**
 * DELETE POST
 */
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    connection.query('DELETE FROM sensor_data WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to posts page
            res.redirect('/sensor_data')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to posts page
            res.redirect('/sensor_data')
        }
    })
})

module.exports = router;