import React from "react";
import { Card } from "./card";

export const ArticleList = ({ children }) => (
  <div className="flex flex-wrap justify-start items-stretch">{children}</div>
);
