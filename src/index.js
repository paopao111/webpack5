import "./index.css";
import React from "react";
console.log("this is demo");
import("./log").then((log) => {
  log(999);
});
React.createElement("div");

export function log_a(msg) {
  console.log("log_a");
}

export function log_b(msg) {
  console.log("log_b");
}
