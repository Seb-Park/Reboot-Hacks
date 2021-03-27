var placeholderId = "9aU7nSLWOPa0c26Tm1d5dMIbyf32";

const navigateToPage = async (path) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
    //   console.log(this.responseXML.title);
        var htmlAsString = new XMLSerializer().serializeToString(this.responseXML);
        document.getElementById("content").innerHTML = htmlAsString;
        var script = document.createElement('script');
        script.setAttribute('src', path+".js");
        script.setAttribute('type', 'text/javascript');
        document.body.appendChild(script);
    }
    xhr.open("GET", path+".html");
    xhr.responseType = "document";
    xhr.send();
}

//
//ACTUALLY MAKE THIS CONTINGENT UPON WHETHER THE SESSION IS 
//ENTERED OR NOT FROM "CHECK SESSION" ENDPOINT
//
// navigateToPage("pages/home");
navigateToPage("pages/page2");

const enterSession = async () => {
    var url = 'https://us-central1-skedjul-3f13c.cloudfunctions.net/enterSession';
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "uid": placeholderId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(url);
    return response.json();
}

function enterSessionWithNavigation(){
    navigateToPage("pages/loading");
    enterSession().then((result) => {
        if(result.result==="success"){
            navigateToPage("pages/page2")
        }
    }).catch(()=>{
        navigateToPage("pages/home")
    })
}

const exitSession = async () => {
    var url = 'https://us-central1-skedjul-3f13c.cloudfunctions.net/exitSession';
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "uid": placeholderId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(url);
    return response.json();
}

function exitSessionWithNavigation(){
    navigateToPage("pages/loading");
    exitSession().then((result) => {
        if(result.result==="success"){
            navigateToPage("pages/home")
        }
    }).catch(()=>{
        navigateToPage("pages/page2")
    })
}