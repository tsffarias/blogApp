var express           = require("express"),
    expressSanitizer  = require("express-sanitizer"),
    methodOverride    = require("method-override"),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    Blog              = require("./models/blog"),
    app               = express();
    
// APP CONFIG    
mongoose.connect("mongodb://localhost/restful_blog_app");    
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.get("/", function(req, res) {
   res.redirect("/blogs"); 
});

// INDEX route
app.get("/blogs", function(req, res) {
   Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {allBlogs: allBlogs});
        }
    });
});

// NEW Route
app.get("/blogs/new", function(req, res) {
   res.render("newBlog");
});

// CREATE Route
app.post("/blogs", function(req, res) {
   req.body.blog.body = req.sanitize(req.body.blog.body);
   
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("newBlog");
           console.log(err);
       } else{
           res.redirect("/blogs");
       }
   });
});

// SHOW Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("showBlog", {blog: foundBlog});
        }
    });
});

// EDIT Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("editBlog", {blog: foundBlog});
        }
    });
});

// UPDATE Route
app.put("/blogs/:id", function(req, res) {
    
   req.body.blog.body = req.sanitize(req.body.blog.body);
   
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
           console.log(err);
       } else{
           res.redirect("/blogs/"+req.params.id);
       }
   });
});

// DELETE Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
           console.log(err);
       } else{
           res.redirect("/blogs");
       }
    });
});

app.get("*", function(req, res) {
   res.send("Error 404: This link doesn't exist yet..."); 
});

app.listen(3000, function(){
   console.log("Running app.js"); 
});
