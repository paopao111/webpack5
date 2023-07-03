import "./index.css";
import "./index.scss";
import React from "react";
console.log("this is demo");
import(
  // https://www.cnblogs.com/dahe1989/p/11543832.html
  // 这里着重讲一下webpackChunkName，它其实就是对chunkFilename定义时[name]值的改写
  /* webpackChunkName: "log" */
  "./log").then((log) => {
  log(999);
});
React.createElement("div");

export function log_a(msg) {
  console.log("log_a");
}

export function log_b(msg) {
  console.log("log_b");
}
