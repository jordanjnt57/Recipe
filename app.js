var express = require('express');
app         = express(),
bodyParser  = require('body-parser'),
mongoose     = require('mongoose');
methodOverride = require('method-override');
expressSanitizer = require('express-sanitizer');


//AppConfig
mongoose.connect('mongodb://localhost/recipe_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//Mongoose/Model Config
var recipeSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
})

var Recipe = mongoose.model('Recipe', recipeSchema);


// RESTful Routes

app.get('/', function(req,res){
    res.redirect('/recipes');
})

//Index Route
app.get('/recipes', function(req,res){
    Recipe.find({}, function(err, recipes){
        if(err){
            console.log('Error')
        } else {
            res.render('index', {recipes: recipes});
        }
    })   
})

//New Route
app.get('/recipes/new', function(req,res){
    res.render('new');
})

//Create Route
app.post('/recipes', function(req,res){
    //Create Recipe
    req.body.recipe.body = req.sanitize(req.body.recipe.body);
    Recipe.create(req.body.recipe, function(err, newRecipe){
        if(err){
            console.log(err);
            res.render('new');
        } else{
            //Redirect to the index
            res.redirect('/recipes');
        }
    })
})

//Show Route
app.get('/recipes/:id', function(req,res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            res.redirect('/recipes');
        } else {
            res.render('show', {recipe: foundRecipe});
        }
    })
})

//Edit Route
app.get('/recipes/:id/edit', function(req,res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            res.redirect('/recipes');
        } else {
            res.render('edit', {recipe: foundRecipe});
        }
    })
})

//Update Route
app.put('/recipes/:id', function(req,res){
    req.body.recipe.body = req.sanitize(req.body.recipe.body);
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
        if(err){
            res.redirect('/recipes');
        } else{
            res.redirect('/recipes/' + req.params.id);
        }
    })
})

//Delete Route
app.delete('/recipes/:id', function(req,res){
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/recipes');
        } else{
            res.redirect('/recipes');
        }
    })
})

app.listen(3000, function(){
    console.log('server is running');
    
});