import http from "node:http";

const host = "localhost";
const port = 8000;

/*function requestListener(_request, response) {              // avant modification
  response.writeHead(200);
  response.end("<html><h1>My first server!<h1></html>");
}*/

/*function requestListener(_request, response) {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "I'm OK" }));
}*/

import fs from "node:fs/promises";

/*function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      return response.end(contents);
    })
    .catch((error) => {
      console.error(error);
      response.setHeader("Content-Type", "text/plain");
      response.writeHead(500); // Définit le code d'erreur 500
      response.end("Erreur 500 (serveur): Le fichier index.html est introuvable.");
    });
}*/

async function requestListenerAwait(_request, response) {
  try {
    const contents = await fs.readFile("index.html", "utf8");
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    return response.end(contents);
  } catch (error) {
    console.error(error);
    response.setHeader("Content-Type", "text/plain");
    response.writeHead(500); // Définit le code d'erreur 500
    response.end("Erreur 500 (serveur): Le fichier index.html est introuvable.");
  }
}

async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");
  try {
    const contents = await fs.readFile("index.html", "utf8");

    const url_split = request.url.split("/");

    switch (url_split[1]) {
      case "index.html":
        response.writeHead(200);
        return response.end(contents);
      case "random":
        const nb = parseInt(url_split[2].split(".")[0], 10)
        
        if (isNaN(nb)) {
          response.writeHead(404);
          return response.end(`<html><p>404: NOT FOUND</p></html>`);
        }

        response.writeHead(200); 
        for (let cpt=0; cpt<nb; cpt++) {
          response.write(`<p>${Math.floor(100 * Math.random())}</p>`);
        }
        return response.end();

      default:
        response.writeHead(404);
        return response.end(`<html><p>404: NOT FOUND</p></html>`);
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
  }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

