import React from 'react'
import PropTypes from 'prop-types'

import { FaHeart as HeartIcon } from 'react-icons/fa'

export class ILike extends React.Component {
	static propTypes = {
		like: PropTypes.array
	}

	static defaultProps = {
		like: ['React', 'Computers', 'Docker', 'Bacon', 'Coffee']
	}

	state = {
		index: this.randomIndex(this.props.like.length)
	}

	componentDidMount() {
		this.rotation = setInterval(() => {
			this.setState(state => {
				if (state.index >= this.props.like.length - 1) {
					return { index: 0 }
				}
				return { index: state.index + 1 }
			})
		}, 5000)
	}

	componentWillUnmount() {
		this.rotation && typeof this.rotation === 'function' && this.rotation()
	}

	randomIndex(max) {
		return Math.floor(Math.random() * Math.floor(max))
	}

	render() {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					// border: '1px solid #ffffff',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 20
				}}
			>
				<div
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						display: 'flex',
						marginRight: 10
					}}
				>
					I
				</div>
				<div style={{ marginRight: 10 }}>
					<HeartIcon color="red" />
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						flexDirection: 'column'
					}}
				>
					<div>{this.props.like[this.state.index] || this.state.index}</div>
				</div>
			</div>
		)
	}
}
