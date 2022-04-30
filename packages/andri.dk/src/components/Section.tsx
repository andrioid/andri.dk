export const Section = ({
  children,
  title,
  bgColorBase = "gray",
  bgColorLevel = 200,
}) => (
  <div
    className={`md:px-20 lg:px-40 text-xl bg-${bgColorBase}-${bgColorLevel} py-6`}
  >
    <h2 className="font-headline ml-6 md:ml-0 font-semibold text-xl md:text-2xl uppercase mb-2">
      {title}
    </h2>
    {children}
  </div>
);
