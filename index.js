import express from "express"
import path from "node:path"
const app = express();
const port = 3000;

app.use(express.static(path.join(import.meta.dirname, "public")));
// app.get("/", (req, res) => {
//     res.send("<h1>Hello from the server.</h1>");
// });

// app.get("/about", (req, res) => {
//     res.send("<h1>About Page</h1>");
// });

app.get("/web", (req, res) => {
    //res.sendFile(path.join(import.meta.dirname, "index.html"));
    res.sendFile(path.join(import.meta.dirname, "public","index.html"));
});

const server = app.listen(port, "127.0.0.1", () => {
    console.log(`Server started listening on port ${port}`);
});
