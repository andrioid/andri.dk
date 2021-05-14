import { NavLink } from "./navlink";
import Image from "next/image";

export function FrontPageHeader() {
  return (
    <section
      id="frontpage-header"
      className="flex flex-col font-sans md:min-h-one-third-screen text-gray-50 bg-blue-700"
      style={{
        background: `url("static/img/wave.svg") no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <nav className="small-profile flex justify-between items-center p-8">
        <Image
          layout="fixed"
          alt="round profile"
          width={64}
          height={64}
          src="/static/img/coffee-art.jpg"
          className="rounded-full shadow-2xl w-16 h-16 md:invisible"
        />
        <div>
          <ul className="flex flex-row">
            <NavLink href="blog/">Blog</NavLink>

            <NavLink href="now/">Now</NavLink>
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
              <span aria-hidden hidden>
                Iceland
              </span>
              <img
                className="inline-block align-middle md:w-8 md:h-8 w-4 h-4"
                alt="Iceland"
                src={"/static/img/iceland-flag.svg"}
              />
              &nbsp; living in &nbsp;
              <img
                className="inline-block align-middle md:w-8 md:h-8 w-4 h-4"
                alt="Denmark"
                src={"/static/img/denmark-flag.svg"}
              />
              <span aria-hidden hidden>
                Denmark
              </span>
            </p>
            <p>&nbsp;</p>

            <p>&nbsp;</p>
            <p>
              I make websites, create apps, manage infrastructure, develop
              products and more.
            </p>
          </div>
        </div>
        <div className="large-profile hidden md:block p-4 items-start justify-start mr-6">
          <Image
            layout="fixed"
            width={128}
            height={128}
            alt="round profile"
            src="/static/img/coffee-art.jpg"
            className="hidden md:block rounded-full shadow-2xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
