exitSessionButton = document.getElementById("exit-session-button");
exitSessionButton.addEventListener("click", function () {
    exitSessionWithNavigation();
});


window.onload = () => {
    alert("kys")
    getCurrentPeriod().then((result) => {
        console.log(result)
        document.getElementById('subject-title').innerHTML = result.period.name;
    });
}