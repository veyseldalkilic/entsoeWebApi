function timeDiff(date) {

    var date = new Date(date);
    var date2 = new Date();
    if (!(date instanceof Date && date2 instanceof Date))
        throw new RangeError('Invalid date arguments');
        
    const timeIntervals = [31536000, 2628000, 604800, 86400, 3600, 60, 1];
    const intervalNames = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];
    const diff = Math.abs(date2.getTime()-date.getTime())/1000;
    const index = timeIntervals.findIndex(i=>(diff/i) >= 1);
    const n = Math.floor(diff/timeIntervals[index]);
    const interval = intervalNames[index];
    return [n, interval];
}

function localize(value, str)
{
    if (value != 1)
        str += 's';
        
    return `${value} ${str} ago`
}

function appendZenHtml(response) {
    document.getElementById("zentitle").innerHTML = response.article.title;
    document.getElementById("zenoriginalarticle").innerHTML = "<a href='" + response.article.html_url +"' target='_blank'>original article</a>";
    document.getElementById("zenoriginalarticle").innerHTML += "&nbsp;&nbsp;&nbsp; Last updated: " + localize(...timeDiff(response.article.updated_at));
    document.getElementById("zencontent").innerHTML =response.article.body;
}

function setErrorMessage(statusCode){
    if (statusCode== 401){
        document.getElementById("zentitle").innerHTML = "You are not authorized to access this website.";
        document.getElementById("zencontent").innerHTML ="Please send an email to transparency@entsoe.eu";
    }else if (statusCode==404){
        document.getElementById("zentitle").innerHTML = "The article can not be found.";
        document.getElementById("zencontent").innerHTML ="Please send an email to transparency@entsoe.eu";
    }else{
        document.getElementById("zentitle").innerHTML = "Unknown problem is encountered.";
        document.getElementById("zencontent").innerHTML ="Please send an email to transparency@entsoe.eu";
    }
}

fetch('https://transparencyplatform.zendesk.com/api/v2/help_center/en-us/articles/12783280128404.json',{method:'GET'})
.then(function(data){
    if(data.status==200)
    {
        return data.json();
        console.log('data status: '+data.status);
    }else{
        console.log('data status: '+data.status);
        setErrorMessage(data.status);
    }
})
.then(function(response){
    appendZenHtml(response);
})
.catch(function(error){
    console.log('error caught');
    document.getElementById("zentitle").innerHTML = "Access to fetch data is blocked.";
    document.getElementById("zencontent").innerHTML ="Please send an email to transparency@entsoe.eu";
});