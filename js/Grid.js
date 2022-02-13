import Invader from './Invader.js'

class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0,
		}
		this.velocity = {
			x: 6,
			y: 2,
		}

		this.invaders = []

		const cols = Math.floor(Math.random() * 5 + 3) //10 + 5     5 - 14
		const rows = Math.floor(Math.random() * 3 + 1) // 5 + 2     2 - 6
		console.log(rows, cols)

		this.width = cols * 40

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				this.invaders.push(
					new Invader({
						position: {
							x: i * 30,
							y: j * 30,
						},
					}),
				)
			}
		}
	}
	update(canvas) {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0

		if (this.position.x + this.width >= canvas.width || this.position.x < 0) {
			this.velocity.x = -this.velocity.x
			this.velocity.y = 75
		}
	}
}

export default Grid
