import type { ReactNode } from "react";

// Wraps the text and handles margins
export const BodyContainer = ({ children }: { children: ReactNode }) => (
  <div className="mt-10 mx-5 md:mx-20 lg:mx-40 text-xl md:max-w-4xl">
    {children}
  </div>
);
