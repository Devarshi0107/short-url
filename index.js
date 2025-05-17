const express= require('express');
const app= express();
const PORT=8001;
const urlRoute=require('./routes/url');
const {connectMongoDb}=require('./connect');
const URL = require('./models/url');
const path=require('path');
const staticRouter=require('./routes/staticRouter');

connectMongoDb('mongodb://localhost:27017/shorturl')
.then(()=>{console.log("MongoDB connected")})
.catch((err)=>console.log("MongoDB connection error",err));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Catch invalid JSON errors

app.listen(PORT,()=>
console.log(`Server started at PORT : ${PORT}`)
);

app.use("/url",urlRoute);
app.use("/",staticRouter);
//serverside rendering wihhtut ejs

// app.get("/test",async(req,res)=>{
//     const allurls=await URL.find({});
//     return res.end(`
//         <html>
//             <head>
//                 <title>All URLs</title>
//             </head>
//             <body>
//                 <h1>All URLs</h1>
//               ${allurls
//             .map(url =>
//               `<li>
//                  <a href="/${url.shortId}">
//                    ${url.shortId} – ${url.redirectURL} – ${url.visitHistory.length}
//                  </a>
//                </li>`
//             )
//             .join("")}
//         </ul>
//             </body>
//         </html>
//     `);
// } );
  

//with ejs

app.get("/test",async(req,res)=>{
    const allurls=await URL.find({});
    return res.render("home",{
        urls:allurls,
        name:'allurls',
    });
} );

//dynamic route

app.get("/url/:shortId",async(req,res)=>{
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
    // Check if shortId was found
    if (!entry) {
        return res.status(404).send("<h2>Short URL not found</h2>");
    }
    res.redirect(entry.redirectURL);
})
