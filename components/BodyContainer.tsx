import React from "react";

// Wraps the text and handles margins

export const BodyContainer = ({ children, className }) => (
  <div className="mt-10 mx-5 md:mx-10 md:mx-20 lg:mx-40 text-xl md:max-w-4xl">
    {children}
  </div>
);
