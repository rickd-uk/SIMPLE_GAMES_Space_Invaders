class Player {
	constructor(canvas) {
		this.position = {
			x: canvas.width / 2 - this.width / 2,
			y: canvas.height - this.height - 20,
		}
		this.velocity = {
			x: 0,
			y: 0,
		}

		this.rotation = 0

		const image = new Image()
		image.src = './img/spaceship.png'
		image.onload = () => {
			const scale = 0.15
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.setPosition(canvas)
		}
	}

	setPosition(canvas) {
		this.position = {
			x: canvas.width / 2 - this.width / 2,
			y: canvas.height - this.height - 20,
		}
	}

	redrawOnResize(canvas) {
		canvas.width = innerWidth
		canvas.height = innerHeight
		this.setPosition(canvas)
	}

	draw(c) {
		c.save()
		c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
		c.rotate(this.rotation)
		c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
		// c.fillStyle = 'red'
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)
		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
		c.restore()
	}

	update(c) {
		if (this.image) {
			this.draw(c)
			this.position.x += this.velocity.x
		}
	}
}

export default Player
