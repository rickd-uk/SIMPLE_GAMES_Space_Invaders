class Particle {
	constructor({ position, velocity, radius, color, fades }) {
		this.position = position
		this.velocity = velocity

		this.radius = radius
		this.color = color
		this.opacity = 1
		this.fades = fades
	}

	spawn() {}

	draw(c) {
		c.save()
		c.globalAlpha = this.opacity
		c.fillStyle = this.color
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		c.fill()
		c.closePath()
		c.restore()
	}
	update(c) {
		this.draw(c)
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.fades) this.opacity -= 0.01
	}
}

export default Particle
