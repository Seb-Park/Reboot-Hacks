exitSessionButton = document.getElementById("exit-session-button");
exitSessionButton.addEventListener("click", function () {
    exitSessionWithNavigation();
});

// console.log(result)
document.getElementById('subject-title').innerHTML = currentSubject.toUpperCase();
// alert(currentSubject)
getCurrentPeriod().then((periodRes) => {
    document.getElementById('subject-title').innerHTML = periodRes.period.name.toUpperCase();
})