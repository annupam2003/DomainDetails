const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const app= express();
const PORT=4200;
const Url ='https://www.whois.com/whois/';
const infomation = [];

app.get('/api/Domain/:Name',(req,res)=>{
    const startdt = new Date();
    const DomainName = req.params.Name;

    axios(Url+DomainName).then(response =>{
        infomation.length=0;    
        const html = response.data;
        const $ = cheerio.load(html);
        $('.df-block',html).each(function(){
            const heading = $(this).find('.df-heading').text();
            const rows=[];
           
            $(this).find('.df-row').each(function(){
                const lv = $(this).find('.df-label').text();
                const label=lv.substr(0,lv.length-1);
                const value = $(this).find('.df-value').text();
                rows.push({
                    label,
                    value
                });
            });
            infomation.push({
                heading,rows
            });
        });
        const enddt = new Date();
        console.log(DomainName+' '+(enddt.getTime()- startdt.getTime())+' ms');
        res.send(infomation.length > 0?JSON.stringify(infomation):JSON.stringify({"status":"Domain not found"}));
    }).catch(err => console.log(err) );
});

app.listen(PORT,()=>{ console.log(`Current Running Port is ${PORT}`)});