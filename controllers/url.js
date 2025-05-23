const {nanoid}=require('nanoid');
const URL=require('../models/url');
const { totalmem } = require('os');

async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    if(!body.url)
        return res.status(400).json({error:"URL is required"});
    const shortId=nanoid(8);
    await URL.create({
        shortId:shortId,
        redirectURL:body.url,
        visitHistory:[]
    });
    return res.render("home",{
        id:shortId,
    })
    // return res.json({id:shordId})
}

async function handleGetAnalytics(req,res) {
    const shortId=req.params.shortId;

    const result=await URL.findOne({shortId});
    return res.json({
        totalclicks:result.visitHistory.length,
        analytics:result.visitHistory,
    });
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
}