class Invader {
	constructor({ position }) {
		this.velocity = {
			x: 0,
			y: 0,
		}

		const image = new Image()
		image.src = './img/invader.png'
		image.onload = () => {
			const scale = 1
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: position.x,
				y: position.y,
			}
		}
	}

	redrawOnResize(canvas) {
		canvas.width = innerWidth
		canvas.height = innerHeight
		this.setPosition(canvas)
	}

	draw(c) {
		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
	}

	update(c, { velocity }) {
		if (this.image) {
			this.draw(c)
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}
}

export default Invader
