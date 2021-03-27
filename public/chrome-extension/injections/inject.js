var fonts = document.createElement("link");
fonts.rel = "stylesheet";
fonts.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@100;300;400;500;600&family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap";

document.head.appendChild(fonts);

var overlay = document.createElement("div");
overlay.className = "procrastination-overlay";

var procrastinationContent = document.createElement("div");
procrastinationContent.className = "procrastination-content";

var oopsText = document.createElement("div");
oopsText.className = "oops-text";
oopsText.innerHTML = "Oops!";

procrastinationContent.appendChild(oopsText);

var explanation = document.createElement("div");
explanation.className = "procrastination-explanation";
explanation.innerHTML = "Looks like this website isn't your homework for right now!"

procrastinationContent.appendChild(explanation)

var buttonOptions = document.createElement("div");
buttonOptions.className = "procrastination-button-options";

var button1 = document.createElement("div");
button1.className = "procrastination-button procrastination-button-1";
button1.innerHTML = "Yes, it is.";
button1.addEventListener("click", function(){
    overlay.remove();
})

var button2 = document.createElement("div");
button2.className = "procrastination-button procrastination-button-2";
button2.innerHTML = "Sorry!";

button2.addEventListener("click", function(){
    window.location.href = "https://google.com";
})

buttonOptions.appendChild(button1);
buttonOptions.appendChild(button2);

procrastinationContent.appendChild(buttonOptions)

overlay.appendChild(procrastinationContent);

document.body.appendChild(overlay);

// chrome.webRequest.onBeforeRequest.addListener(
// 	function(details) {
// 		console.log("blocking:", details.url);
// 		return {cancel: true };
// 	},
// 	{urls: ["*://*.youtube.com/"]},
// 	["blocking"]
// );