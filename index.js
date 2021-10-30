const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const { response, request } = require('express');
const { insertBefore } = require('cheerio/lib/api/manipulation');
const PORT=5400;
const app= express();
const Url ='https://www.whois.com/whois/';
const infomation = [];

function DomainInfo(DomainName){    
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
    }).catch(err => console.log(err) );
}


app.get('/api/Domain/:Name',(request,response)=>{
    const DomainName=request.params.Name;    
     DomainInfo(DomainName);
     if(infomation.length > 0){
        response.send(JSON.stringify(infomation));    
     }
     else{
        response.send(JSON.stringify({"status":"Domain not found"}));    
     }
});




app.listen(PORT,()=>{ console.log(`Current Running Port is ${PORT}`)});