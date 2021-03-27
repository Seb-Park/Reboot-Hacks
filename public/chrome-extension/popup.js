const enterSession = async () => {
    var url = 'https://pokeapi.co/api/v2/pokemon/ditto';
    url = 'https://us-central1-skedjul-3f13c.cloudfunctions.net/enterSession';
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "uid": "9aU7nSLWOPa0c26Tm1d5dMIbyf32"
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(url);
    return response.json();
}

enterSessionButton = document.getElementById("enter-session-button");
enterSessionButton.addEventListener("click", function () {
    enterSession().then((result) => {
        alert(result.result);
    })
});