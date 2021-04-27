//server.js
const _app = require("./app");
const port = process.env["NODE_PORT"] ? process.env["NODE_PORT"] : 5002;
if (process.env.NODE_ENV !== "test") {
    _app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
}

