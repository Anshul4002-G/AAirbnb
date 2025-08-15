const Homes = require("../model/homes");
const User = require("../model/user");

exports.getfavourite =async (req, res, next) => {
    const userId=req.session.user._id;
    const user = await User.findById(userId).populate("favourites");
    res.render("store/fav-home",{
        homes:user.favourites,
        isLoggedIn:req.isLoggedIn,
        user:req.session.user,
    })
}

exports.postfavhomes=async (req,res,next)=>{
    const homeId=req.body.id;
    const userId=req.session.user._id;
    const user=await User.findById(userId);
    if(!user.favourites.includes(homeId)){
        user.favourites.push(homeId);
        await user.save();
    }
    res.redirect("/favourite")
}

exports.postdeletefavhome=async(req,res,next)=>{
    const homeId=req.params.homeid;
    const userId=req.session.user._id;
    const user= await User.findById(userId);
    if(user.favourites.includes(homeId)){
        user.favourites=user.favourites.filter(fav=>fav!=homeId);
        await user.save();
    }
    res.redirect("/favourite");
}


exports.getbookings =async (req, res, next) => {
    const userId=req.session.user._id;
    const user=await User.findById(userId).populate("booked");
    res.render("store/booking",{
        homes:user.booked,
        isLoggedIn:req.isLoggedIn,
        user:req.session.user,
    });
}

exports.getexplore = (req, res, next) => {
    Homes.find().then(registeredHomes =>
        res.render('store/explore', {
            homes: registeredHomes,
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        })
    );
}

exports.getabout = (req, res, next) => {
    Homes.find().then(registeredHomes =>
        res.render('store/about', {
            homes: registeredHomes,
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        })
    );
}


exports.postbooking=async (req,res,next)=>{
     const userId=req.session.user._id;
    const user=await User.findById(userId).populate("booked");
    if(user){
    res.render("store/booking",{
        homes:user.booked,
        isLoggedIn:req.isLoggedIn,
        user:req.session.user,
    });
}
else{
    res.redirect("/nffn");
}
}