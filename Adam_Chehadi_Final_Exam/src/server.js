/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
const axios = require('axios');
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



app.get('/', function(req, res) {
    res.render('pages/home', {
        my_title: "Home Page",
        items: 'blank',
        error: false,
    });
});


app.get('/reviews', function(req, res) {
  var get_all = 'SELECT * FROM movie_reviews;';

  db.any(get_all)
      .then(function (items) {
          res.render('pages/reviews',{
              my_title: "Reviews",
              data: items,
              err: false,
          })
      })
      .catch(function (err) {
          res.render('pages/reviews',{
              my_title: "Reviews",
              data: '',
              err: true,
          })
      })

});


app.post('/reviews/addReview', function(req, res) {
    var f_inp = req.body.f_inp;
    var f_ta = req.body.f_ta;

    let cDate = new Date();

    var insert = "INSERT INTO movie_reviews(movie_name, review_text, review_date) VALUES('"+f_inp+"','"+f_ta+"','"+cDate.toISOString()+"');"
    var get_all = 'SELECT * FROM movie_reviews';

    db.task('get-everything', task => {
        return task.batch([
            task.any(insert),
            task.any(get_all)
        ]);
    })
    .then(info => {
        res.render('pages/reviews',{
            my_title: 'Reviews',
            data: info[1],
            err: false,
        })
    })
    .catch(err => {
		res.render('pages/reviews', {
			my_title: 'Reviews',
            data: '',
            err: true,
		})
	});
});


app.get('/reviews/filter', function(req,res) {
	var query = req.query.query;
	console.log(query);
	var get_filter = "SELECT * FROM movie_reviews WHERE movie_name LIKE '%" + query + "%';";
	var get_all = 'SELECT * FROM movie_reviews';

	db.task('get-everything', task => {
		return task.batch([
			task.any(get_filter),
			task.any(get_all)
		]);
	})
	.then(info => {
		if(info[0].length) {
			res.render('pages/reviews',{
				my_title: 'Reviews',
				data: info[0],
				err: false,
			})
		} else {
			res.render('pages/reviews',{
				my_title: 'Reviews',
				data: info[1],
				err: true,
			})
		}
	})
	.catch(err => {
		res.render('pages/reviews', {
			my_title: 'Reviews',
			data: '',
			err: true,
		})
	});
});


app.get('/get_movie', function(req, res) {
  var query = req.query.query;
  
  if(query) {
      axios({
          url: `http://www.omdbapi.com/?t=${query}&apikey=f3acbbe9`,
          method: 'GET',
          dataType: 'json',
      })
      .then(items=> {
          res.render('pages/home', {
              my_title: "Results for " + query,
              items: items.data,
              error: false,
          });
          res.status(200).send();
      })
      .catch(error => {
          console.log(error)
          res.render('pages/home', {
              my_title: "Home Page",
              items: '',
              error: true,
          });
          res.status(200).send();
      });
  } else {
      res.render('pages/home', {
          my_title: "Home Page",
          items: '',
          error: true,
      });
      res.status(204);
  }
});


const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });