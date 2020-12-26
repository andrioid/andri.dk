import React from "react";

export function Test({
  hello,
}: {
  /** Why must this be so annoying */
  hello: string; // Awesome sauce
  world: string; // meow
}) {
  return <p className="bg-blue-200">Meow: {hello}</p>;
}
