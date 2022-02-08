class Projectile {
	constructor({ position, velocity, radius, color }) {
		this.position = position
		this.velocity = velocity

		this.radius = radius
		this.color = color
		this.opacity = 1
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

		this.opacity -= 0.01
	}
}

export default Projectile
