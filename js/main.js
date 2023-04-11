const url = "https://jsonplaceholder.typicode.com/posts";

const carregando = document.querySelector("#loading");

const postContainer = document.querySelector("#posts-container");

const comentarios = document.querySelector("#comments-container");

const postPage = document.querySelector("#posts");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body-comment");

const urlSearch = new URLSearchParams(window.location.search);
const postId = urlSearch.get("id");

async function api() {
  const conexao = await fetch(url);
  const conexaoConvertida = await conexao.json();

  console.log(conexaoConvertida);

  carregando.classList = "hide";

  conexaoConvertida.map((post) => {
    const poster = document.createElement("div");
    const titulo = document.createElement("h2");
    const bodyPost = document.createElement("p");
    const link = document.createElement("a");

    poster.classList = "poster";
    titulo.innerHTML = post.title;
    bodyPost.innerHTML = post.body;

    link.className = "btn";
    link.innerHTML = "Ler";
    link.setAttribute("href", `/src/post.html?id=${post.id}`);

    poster.appendChild(titulo);
    poster.appendChild(bodyPost);
    poster.appendChild(link);

    postContainer.appendChild(poster);
  });
}

async function getPosts(id) {
  const [responsePost, responseComents] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();
  const dataComment = await responseComents.json();

  console.log(dataComment);
  carregando.classList.add("hide");
  postPage.classList.remove("hide");

  const poster = document.createElement("div");
  const titulo = document.createElement("h2");
  const bodyPost = document.createElement("p");

  poster.classList = "poster-page";
  titulo.innerHTML = dataPost.title;
  bodyPost.innerHTML = dataPost.body;

  poster.appendChild(titulo);
  poster.appendChild(bodyPost);

  postContainer.appendChild(poster);

  dataComment.map((comment) => {
    createComment(comment);
  });
}

function createComment(comment) {
  const comentario = document.createElement("div");
  const email = document.createElement("h3");
  const body = document.createElement("p");

  comentario.classList = "comentario";

  email.innerHTML = comment.email;
  body.innerHTML = comment.body;

  comentario.appendChild(email);
  comentario.appendChild(body);

  comentarios.appendChild(comentario);
}

async function postComment(comment) {
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await response.json();

  console.log(data);

  createComment(data)
}

if (!postId) {
  api();
} else {
  getPosts(postId);

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };

    console.log(comment);

    postComment(comment);
  });
}
