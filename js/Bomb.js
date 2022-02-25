class Bomb {
	static radius = 30
	constructor({ canvas, velocity }) {
		this.radius = 0
		this.position = {
			x: this.randomBetween(Bomb.radius, canvas.cWidth - Bomb.radius),
			y: this.randomBetween(Bomb.radius, canvas.cHeight - Bomb.radius),
		}
		this.velocity = velocity
		this.opacity = 1
		this.color = 'red'
		this.active = false

		gsap.to(this, {
			radius: 30,
		})
	}

	randomBetween(min, max) {
		return Math.random() * (max - min) + min
	}

	explode() {
		this.active = true
		this.velocity.x = 0
		this.velocity.x = 0
		gsap.to(this, {
			radius: 200,
			color: 'white',
		})
		gsap.to(this, {
			delay: 0.1,
			opacity: 0,
			color: 'white',
		})
	}

	draw(c) {
		c.save()
		c.beginPath()
		c.globalAlpha = this.opacity
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		c.closePath()
		c.fillStyle = this.color
		c.fill()
		c.restore()
	}

	update(c, cWidth, cHeight) {
		this.draw(c)
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// Keep bombs on screen
		if (this.position.x + this.radius * 2 + this.velocity.x >= cWidth || this.position.x - this.radius * 2 + this.velocity.x <= 0) {
			this.velocity.x = -this.velocity.x
		} else if (this.position.y + this.radius * +this.velocity.y >= cHeight || this.position.y - this.radius + this.velocity.y <= 0) {
			this.velocity.y = -this.velocity.y
		}
	}
}

export default Bomb
