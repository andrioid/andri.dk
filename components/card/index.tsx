import React from "react";
import { FaCalendarAlt as FaCalendar } from "react-icons/fa";
import Link from "next/link";
import { formatDate } from "../../lib/date";

export const Card = ({
  title = "",
  description = "",
  date = new Date(),
  link = "#",
  tags = [],
  draft = false,
}: {
  title?: string;
  description?: String;
  date?: Date;
  link?: string;
  tags?: string[];
  draft?: boolean;
}) => (
  <Link href={link}>
    <div className="flex pt-2 sm:pt-4 sm:pr-4 lg:pr-6 w-full sm:w-1/2 xl:w-1/3">
      <div className="shadow-lg bg-white hover:shadow-2xl text-gray-900">
        <div className="flex flex-col px-6 pb-4 justify-between h-full">
          <div className="mt-4 text-sm text-gray-600 flex justify-start items-center">
            <FaCalendar />
            <span className="ml-2">{formatDate(date)}</span>
          </div>

          <div className="flex mt-1 font-bold text-lg lg:text-xl mb-2">
            <Link href={link}>
              <a className="hover:underline">{title}</a>
            </Link>
          </div>
          <div className="flex flex-1 text-base h-20">
            <p className="">{description}</p>
          </div>
          {tags.length > 0 ? (
            <div className="py-4">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="andri-tag">
                  {t}
                </span>
              ))}
              {draft ? (
                <span className="andri-tag text-white bg-red-400">Draft</span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4"></div>
      </div>
    </div>
  </Link>
);
