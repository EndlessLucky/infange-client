const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/api", {
      target: "http://localhost:9003/"
    })
  );
  app.use(
    proxy("/socket", {
      target: "http://localhost:9003/"
    })
  );
  // app.use(proxy("/api/Login", {
  //     "target": "http://localhost:9003/"
  // }));
  // app.use(proxy("/api/account", {
  //     "target": "http://localhost:9005/"
  // }));
  // app.use(proxy("/images", {
  //     "target": "http://localhost:9005/"
  // }));
  // app.use(proxy("/api/objectives", {
  //     "target": "http://localhost:9001/"
  // }));
  // app.use(proxy("/api/notes", {
  //     "target": "http://localhost:9001/"
  // }));
  // app.use(proxy("/api/meetings", {
  //     "target": "http://localhost:9002/"
  // }));
  // app.use(proxy("/api/documents", {
  //     "target": "http://localhost:9002/"
  // }));
  // app.use(proxy("/api", {
  //     "target": "http://localhost:9003/"
  // }));
  // app.use(proxy("/avatar", {
  //     "target": "http://localhost:9003/"
  // }));
};
