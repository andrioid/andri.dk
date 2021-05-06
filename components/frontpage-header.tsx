import { NavLink } from "./navlink";

export function FrontPageHeader() {
  return (
    <section
      id="frontpage-header"
      className="flex flex-col font-sans md:min-h-one-third-screen text-white bg-blue-700 bg-fixed"
      style={{
        background: `/img/header.svg`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "darken",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.33)",
          flex: 1,
        }}
      >
        <nav className="flex items-end justify-end justify-between items-center p-8">
          <img
            alt="round profile"
            src="/img/andratar.jpg"
            className="rounded-full shadow-2xl w-16 h-16 md:invisible"
          />
          <div>
            <ul className="flex flex-row">
              <NavLink href="blog/">Blog</NavLink>

              <NavLink href="now/">Now</NavLink>
              <NavLink href="cv.pdf">CV</NavLink>
            </ul>
          </div>
        </nav>
        <div className="mx-10 md:mx-20 pb-8 lg:mx-40 flex flex-row flex-wrap font-headline text-2xl">
          <div className="flex-1">
            <h2 className="font-headline md:text-6xl text-3xl font-semibold inline-block my-2">
              Hi, I'm Andri
            </h2>
            <div className="text-lg md:text-2xl">
              <p>
                Computer Engineer from &nbsp;
                <span aria-hidden></span>
                &nbsp;<span hidden>Iceland</span> living in &nbsp;
                <span hidden>Denmark</span>
              </p>
              <p>&nbsp;</p>
              <p>
                I make websites, create apps, manage infrastructure, develop
                products and more.
              </p>
            </div>
          </div>
          <div className="hidden md:block p-4 items-start justify-start flex mr-6">
            <img
              alt="round profile"
              src="/img/andratar"
              className="rounded-full shadow-2xl block mx-auto md:w-48 md:h-48"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
