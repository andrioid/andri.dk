import React from 'react'
import PagesLayout from '../layouts/pages'
import { BodyContainer } from '.'

const Section = ({ children, title }) => (
	<div className="mt-6 leading-relaxed text-sm md:text-lg">
		<h2 className="text-xl font-semibold">{title}</h2>
		{children}
	</div>
)

const NowPage = ({ data }) => (
	<PagesLayout>
		<BodyContainer>
			<h1 className="text-3xl font-semibold">What I'm doing now</h1>
			<Section title="Reading again!">
				<p>
					Currently churning through The Dresden Files series (book 8 atm). I
					love these books. They mix together fantasy, old school investigative
					stories and a the Bruce Willis of wizards. Always in the wrong place
					at the wrong time.
				</p>
			</Section>

			<Section title="Programming, for fun">
				<p>
					I have a few pet-projects that I'm working on. Mostly for learning
					purposes, but it would sure be fun to spawn a business at some point.
				</p>
				<p>&nbsp;</p>
				<p>
					I'm reading and experimenting with event-sourcing, cqrs and
					domain-driven-design on the backend and on the frontend I'm playing
					with Tailwind CSS.
				</p>
			</Section>

			<Section title="My son keeps growing">
				<p>
					Our little half-Icelandic, half-Dane, all Viking son keeps us
					entertained and challanged at home. He's soon to be 5 years old and
					his little head is filled with questions that I hope Wikipedia can
					help answer.
				</p>
				<p>&nbsp;</p>
				<p>
					He's already very interested in computers of all sizes, but I dare not
					push it on him. He'll get there if and when he wants to.
				</p>
			</Section>

			<Section title="Engaged, but not in a hurry">
				<p>
					Me and my girlfriend got engaged last October. I proposed during a
					hide-and-seek game with our son. I was going for: "rememberable, but
					silly". I think I nailed it. No date set yet.
				</p>
			</Section>

			<Section title="Recently switched jobs">
				<p>
					I was forced to quit a job that I loved last April. The could smell
					the burnout coming and had to bail out.
				</p>
				<p>&nbsp;</p>
				<p>
					I took a job in May at an Aarhus based company (1 hour drive).
					Fortunately, they were kind enough to allow me to work from here 4
					days a week. It's still quite new, so we'll see how it works out.
				</p>
			</Section>

			<Section title="[Last updated: 2019-07-22]"></Section>

			<div className="mt-10">
				<p className="text-sm">
					Inspired by{' '}
					<a className="link" href="#">
						Derek Sivers' now page
					</a>
					.
				</p>
			</div>
		</BodyContainer>
	</PagesLayout>
)

export default NowPage
