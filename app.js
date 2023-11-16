// including express package
const express = require('express');

// including path module
const path = require('path');

// including mongoose
const mongoose = require('mongoose');

// including method-override
const methodOverride = require('method-override');

// importing models
const Listing = require('./models/listing.js')

// establishing connection with mongoose
main().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1/wanderlust');
}

const port = 8080;
const app = express();

// setting view engine as ejs
app.set('view engine', 'ejs');

// setting path for views directory
app.set('views', path.join(__dirname, 'views'));

// setting middleware for method-override
app.use(methodOverride('_method'));

// handling form data
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// handling request for route /
app.get('/', (req, res) => {
    res.send('Welcome to Home');
})

// route for /listings
app.get('/listings', async (req,res)=>{
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs',{allListings});

});
// route to generate form to create new listing
app.get('/listings/new',(req,res)=>{
    res.render('./listings/new.ejs');
});

// handling form data passed by form to create new listing
app.post('/listings', async(req,res)=>{

    // passing data from form as an object and accessing that object here
    let listing = req.body.listing;
    // console.log(listing);

    const newListing =  new Listing(listing);
    await newListing.save();

    res.redirect('/listings');
})

// route to generate edit form for our listing
app.get('/listing/:id/edit', async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(`${id}`);
    res.render('./listings/edit.ejs',{listing});
});

// handling edit form data
app.put('/listings/:id', async (req,res)=>{
    let { id } = req.params;
    //  await Listing.findByIdAndUpdate(`${id}`,{...req.body.listing}); is same as below code

    await Listing.findByIdAndUpdate(`${id}`,req.body.listing);
     res.redirect(`/listings/${id}`);
});

// route for handling delete requests
app.delete('/listings/:id', async( req, res)=>{
    let { id } = req.params;

    await Listing.findByIdAndDelete(`${id}`);

    res.redirect('/listings');
})

// route for showing specific listing 
app.get('/listings/:id', async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(`${id}`);
    res.render('./listings/show.ejs',{listing});
});


// testing our model
// app.get('/testListing',(req,res)=>{
//     let sample = new Listing({
//         title:"My old Villa",
//         description : "by the beach",
//         price : 1200,
//         image:"",
//         location : 'Goa',
//         country : "India"
//     });
//     sample.save().then((data)=>{
//         console.log('data inserted successfully');
//         console.log(data);
//     });
//     res.send('success');
// })

// listening app server 
app.listen(port, (req, res) => {
    console.log(`server is running on http://localhost:${port}`);
})