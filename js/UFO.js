class UFO {
	constructor({ position }) {
		this.velocity = {
			x: 0,
			y: 0,
		}
		this.position = {
			x: position.x,
			y: position.y,
		}

		const image = new Image()
		image.src = './img/ufo1.png'

		image.onload = () => {
			const scale = 1.2
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
		}
	}

	draw(c) {
		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
	}

	update(c, cWidth, { velocity }) {
		if (this.image) {
			this.draw(c)
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
		if (this.position.x >= cWidth) {
			this.position.x = 0
		}
	}
}

export default UFO
