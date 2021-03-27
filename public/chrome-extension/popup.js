const enterSession = async () => {
    const response = await fetch('https://us-central1-skedjul-3f13c.cloudfunctions.net/enterSession', {
      method: 'POST',
      body: {
          uid: "9aU7nSLWOPa0c26Tm1d5dMIbyf32"
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

enterSessionButton = document.getElementById("enter-session-button");
enterSessionButton.addEventListener("click", async function(){
    enterSession
});