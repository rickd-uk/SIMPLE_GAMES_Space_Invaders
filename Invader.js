class Invader {
	constructor(canvas) {
		this.position = {
			x: canvas.width / 2 - this.width / 2,
			y: canvas.height - this.height - 20,
		}
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
			this.setPosition(canvas)
		}
	}

	setPosition(canvas) {
		this.position = {
			x: canvas.width / 2 - this.width / 2,
			y: canvas.height / 2,
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

	update(c) {
		if (this.image) {
			this.draw(c)
			this.position.x += this.velocity.x
			this.position.y += this.velocity.y
		}
	}
}

export default Invader
