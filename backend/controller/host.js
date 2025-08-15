const Home=require('../model/homes');
const fs=require('fs');
const User = require('../model/user');

exports.getHome = (req, res, next) => {
    Home.find()
    .then(registeredhomes=>{
        res.render("host/home", {
        homes:registeredhomes,
        isLoggedIn:req.isLoggedIn,
        user:req.session.user,
    });
    })
}
exports.getaddhome = (req, res, next) => {
    res.render("host/add-home", {
        isLoggedIn:req.isLoggedIn,
        homes: [],
        user:req.session.user,
        editing:false,
    });
}

exports.postaddhome=(req,res,next)=>{
    const {housename , price , location , rating  , description }=req.body;
    // console.log(req.file.path);
    const photo=req.file.path;

    const newHome=new Home({housename , price , location , photo,rating , description });
    newHome.save();
    res.redirect('/host-home-list');
}

exports.getHomeDetails=(req,res,next)=>{
    const homeId=req.params.homeid;
    Home.findById(homeId).then((home)=>{
        res.render("store/home-details",{
            isLoggedIn:req.isLoggedIn,
            home:home,
            user:req.session.user,
        })
    })
}



exports.gethosthomelist=(req,res,next)=>{
      Home.find().then(registeredHomes =>
        res.render('host/home-list', {
            homes: registeredHomes,
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        })
    );
}


exports.getEdithome=(req,res,next)=>{
    const homeId=req.params.homeid;
    const editing=req.query.editing=true;

     Home.findById(homeId).then((home)=>{
        if(!home){
            console.log("home not found");
            res.redirect("/host-home-list");
        }
        res.render("host/add-home",{
            home:home,
            isLoggedIn:req.isLoggedIn,
            user:req.session.user,
            editing:true,
        })
     })
}


exports.postEdithome=(req,res,next)=>{
    const {id,housename  ,location , price , rating , description}=req.body;
    console.log(id);
    Home.findById(id).then((home)=>{
        home.housename=housename;
        home.location=location;
        home.price=price;
        home.description=description;
        home.rating=rating;

        if(req.file){
            fs.unlink(home.photo , (err)=>{
                if(err){
                    console.log(err);
                }
            });
            home.photo=req.file.path;
        }
        home.save().then(()=>{
            res.redirect("/host-home-list")
        }).catch(err=>{
            console.log("error in saving new home",err);
        })
    }).catch((err)=>{
        console.log("home not found to edit",err)
    })
}



exports.postdeletehome=(req,res,next)=>{
    const homeId=req.params.homeid;
    console.log(homeId);
    Home.findByIdAndDelete(homeId).then(()=>{
        res.redirect("/host-home-list")
    })
}





exports.postbooked=async(req,res,next)=>{
    const homeId=req.body.id;
    const userId=req.session.user._id;
    const user=await User.findById(userId);
    console.log(user);
    if(!user.booked.includes(homeId)){
        user.booked.push(homeId);
        await user.save();
    }
    res.redirect('/booking');
    console.log(homeId);
}


exports.postCancelBooking=async (req,res,next)=>{
    const homeId=req.params.homeid;
    const userId=req.session.user._id;
    const user = await User.findById(userId);
    if(user.booked.includes(homeId)){
        user.booked=user.booked.filter(booked=>booked!=homeId);
        await user.save();
    }
    res.redirect("/booking");
}

exports.getProfile=(req,res,next)=>{
    res.render('host/profile',{
        title:'Profile',
        user:req.user,
        isLoggedIn:req.isLoggedIn,
    });
}

