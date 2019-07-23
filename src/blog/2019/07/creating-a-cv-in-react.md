---
path: '/blog/2019-07/creating-a-cv-in-react'
date: '2019-07-22T00:00:00.000Z'
title: 'Creating a CV in React'
tags: ['cv', 'projects']
cover: './cvscreenshot.png'
draft: true
---

## TLDR;

- [See my CV](/cv.pdf)
- [See the code](https://github.com/andrioid/andri.dk/tree/master/src/cv)

## But why?

I never much cared for pixel-pushing on screen. It has always been a necessary evil. But, print? Love that shit. I did my university reports in LaTeX, even the graphics and even though the errors were HORRIBLE, it remained a loyal TeX fan.

So when I received a task at work to evaluate [react-pdf](https://react-pdf.org/) vs CSS-printing I knew I had something special to play with.

I wanted the following features:

- Use [JSON resume](https://jsonresume.org/schema/) for the CV data
- Components for for work-experience, education and sections
- My own layout
- Built automatically with my Gatsby site into a PDF file

## A good starting point

There is a an [example](https://github.com/diegomura/react-pdf/tree/master/examples/resume) in the react-pdf repo that has much prettier code then mine. So, if you want to make your own, I suggest you start there.

## Using JSON resume, well mostly

If you're anything like me, you don't like updating your CV, or portfolio. Or you just forget. We can use [one JSON file](https://github.com/andrioid/andri.dk/blob/master/src/cv/resume.json) for all those things and be done with it.

The spec is good, but I made some minor changes to mine. I added a "skills" array to work-item and "color" string to skill-items.

Visit [jsonresume.org](https://jsonresume.org) and make your own _resume.json_ file.

They even offer free hosting and rendering of your résumé, and if you're feeling lazy, then just do that instead.

## Components

I've pasted some code in here, so that you can get a little feeling for how this is built. But, keep in mind that the code might change, and refer to the repo for code-examples.

### Box

A simple box, with an headline.

![box with content](box-operations.png)

```jsx
export const Box = ({ children, title, color, style = {} }) => (
	<View wrap={false} style={{ marginBottom: 20 }}>
		<SectionHeader color={color}>{title}</SectionHeader>
		<View style={{ ...style }}>
			{children && typeof children === 'string' ? (
				<Text>{children}</Text>
			) : (
				children
			)}
		</View>
	</View>
)
```

### Work Item

![box with content](experience-item.png)

```jsx
export const TimelineItem = ({
	title,
	period,
	children,
	employer,
	tags = [],
	location
}) => {
	tags = tags.sort()
	return (
		<View wrap={false} style={{ marginBottom: 10 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 2.5,
					flexWrap: 'wrap'
				}}
			>
				<Text style={{ fontWeight: 'bold' }}>
					{title}, <Text style={{ fontWeight: 'normal' }}>{employer}</Text>
				</Text>
				<Text>{period}</Text>
			</View>

			{children && <Text style={{ marginBottom: 2.5 }}>{children}</Text>}
			{tags && (
				<View style={{ flexDirection: 'row' }}>
					{tags &&
						tags.map(m => (
							<Tag key={m} color={tagColors[m.toLowerCase()]}>
								{m}
							</Tag>
						))}
				</View>
			)}
		</View>
	)
}
```

I looked at various designs on Dribbble and other places until I decided on a layout.

React-pdf uses Yoga for layouts, and if that sounds familiar, then it's because it's react-native's layout engine. It uses flex-box and while very similar to the web version of flex-box, it's not quite the same.
