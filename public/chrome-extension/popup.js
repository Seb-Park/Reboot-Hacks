var placeholderId = "9aU7nSLWOPa0c26Tm1d5dMIbyf32";
var isInSession = false;

const navigateToPage = async (path) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        //   console.log(this.responseXML.title);
        var htmlAsString = new XMLSerializer().serializeToString(this.responseXML);
        document.getElementById("content").innerHTML = htmlAsString;
        var script = document.createElement('script');
        script.setAttribute('src', path + ".js");
        script.setAttribute('type', 'text/javascript');
        document.body.appendChild(script);
    }
    xhr.open("GET", path + ".html");
    xhr.responseType = "document";
    xhr.send();
}

// function checkSession(){
//     var url = 'https://us-central1-skedjul-3f13c.cloudfunctions.net/checkSession';
//     fetch(url, {
//         method: 'POST',
//         body: JSON.stringify({
//             "uid": placeholderId
//         }),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     }).then((res) => {
//         responseJson = res.json();
//         console.log(responseJson)
//     }).catch(() => {
//         alert("Session doc not found. Setting in session to false.")
//         return {result: false};
//     });
// }

const checkSession = async () => {
    var url = 'https://us-central1-skedjul-3f13c.cloudfunctions.net/checkSession';
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

navigateToPage("pages/loading");

checkSession().then((response) => {
    updateInSessionLocalVariable(response.result);
    if (response.result) {
        navigateToPage("pages/page2");
    }
    else {
        navigateToPage("pages/home");
    }
}).catch(() => {
    navigateToPage("pages/home");
})

//
//ACTUALLY MAKE THIS CONTINGENT UPON WHETHER THE SESSION IS 
//ENTERED OR NOT FROM "CHECK SESSION" ENDPOINT
//
// navigateToPage("pages/home");

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
    updateInSessionLocalVariable(true);
    console.log(url);
    return response.json();
}

function enterSessionWithNavigation() {
    navigateToPage("pages/loading");
    enterSession().then((result) => {
        if (result.result === "success") {
            navigateToPage("pages/page2")
        }
    }).catch(() => {
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
    updateInSessionLocalVariable(false);
    console.log(url);
    return response.json();
}

function exitSessionWithNavigation() {
    navigateToPage("pages/loading");
    exitSession().then((result) => {
        if (result.result === "success") {
            navigateToPage("pages/home")
        }
    }).catch(() => {
        navigateToPage("pages/page2")
    })
}

// function updateSyncChromeVariable(key, val) {
//     chrome.storage.sync.set({ key: val }, function () {
//         console.log('Value is set to ' + val);
//     });
// }

// function updateLocalChromeVariable(key, val) {
//     chrome.storage.local.set({ key : val }, function () {
//         console.log('Value is set to ' + val);
//     });
// }

function updateInSessionLocalVariable(val) {
    chrome.storage.local.set({ inSession: val }, function () {
        console.log('In session is set to ' + val);
    });
}

function addWebsiteToNiceList(niceUrl) {
    chrome.storage.local.get("goodSites", function (goodSitesResult) {
        var newList = [];
        if (goodSitesResult.goodSites) {
            var newList = goodSitesResult.goodSites
        }
        // goodSitesResult.goodSites.forEach(website => {

        // });
        newList.push(niceUrl)
        chrome.storage.local.set({ goodSites: newList }, function () {
            console.log('In session is set to ' + newList);
        });
    });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});