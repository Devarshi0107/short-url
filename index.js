const express= require('express');
const app= express();
const PORT=8001;
const urlRoute=require('./routes/url');
const {connectMongoDb}=require('./connect');
const URL = require('./models/url');


connectMongoDb('mongodb://localhost:27017/shorturl')
.then(()=>{console.log("MongoDB connected")})
.catch((err)=>console.log("MongoDB connection error",err));

app.use(express.json());
// Catch invalid JSON errors

app.listen(PORT,()=>
console.log(`Server started at PORT : ${PORT}`)
);

app.use("/url",urlRoute);

//dynamic route

app.get("/:shortId",async(req,res)=>{
    const shortId=req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {shortId},
       {$push:{
            visitHistory:{
                timestamp:Date.now()
            }
       }},
        {new:true}
    );
    res.redirect(entry.redirectURL);
})

