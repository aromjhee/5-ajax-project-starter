function getPic() {
    document.querySelector(".loader").innerHTML = "Loading...";
    document.querySelector(".score").innerHTML = 0;
    document.querySelector('.comments').innerHTML = '';

    fetch("/kitten/image")
        .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json) => {
          document.querySelector(".loader").innerHTML = "";
          document.querySelector(".cat-pic").src = json.src;
        //   document.querySelector("img.cat-pic").setAttribute("src", json.src);
        })
      .catch(err => {
          err.json().then(errorJSON => {
              console.log(errorJSON);
              document.querySelector(".error").innerHTML = `<div>${errorJSON.message}</div>`;
          })

        //   alert('Something went wrong! Please try again!')
      })

}

function vote(karma){
    fetch(`/kitten/${karma}vote`, { method: "PATCH" })
        .then(res => res.json())
        .then(json => document.querySelector(".score").innerHTML = json.score);
}

function postComment(string){
    document.querySelector('.comments').innerHTML = '';

    fetch(`/kitten/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            comment: string
        })
    })
        .then(res => res.json())
        .then(json => {
            json.comments.forEach((comment) =>
            document.querySelector('.comments').innerHTML += `<div>${comment}</div>` );
        })
}

window.addEventListener('DOMContentLoaded', event => {
    getPic();

    document
        .getElementById('new-pic')
        .addEventListener('click', getPic);

    document
        .getElementById('upvote')
        .addEventListener('click', event => vote('up'));

    document
        .getElementById('downvote')
        .addEventListener('click', event => vote('down'));

    document
        .getElementById('submit')
        .addEventListener('click', event => {
            event.preventDefault();
            let userComment = document.getElementById('user-comment').value
            postComment(userComment);
            document.querySelector(".comment-form").reset();
        })
})

