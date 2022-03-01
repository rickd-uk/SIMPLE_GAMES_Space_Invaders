import Particle from './Particle.js'

class Background {
	constructor(canvas) {
		this.particles = []
		this.createBGStars(canvas)
	}

	createBGStars(canvas) {
		for (let i = 0; i < 100; i++) {
			this.particles.push(
				new Particle({
					position: {
						x: Math.random() * canvas.width,
						y: Math.random() * canvas.height,
					},
					velocity: {
						x: 0,
						y: 0.2,
					},
					radius: 1,
					color: 'white',
				}),
			)
		}
		console.log(this.particles)
	}

	updateBGStars(canvas) {
		const c = canvas.getContext('2d')

		this.particles.forEach((particle, idx) => {
			// reuse background stars - those that reach the bottom of the canvas
			// are place back in the top with a random x pos
			if (particle.position.y - particle.radius >= canvas.height) {
				particle.position.x = Math.random() * canvas.width
				particle.position.y = -particle.radius
			}
			// remove particles to cleanup (for performance)
			if (particle.opacity <= 0) {
				setTimeout(() => {
					this.particles.splice(idx, 1)
				}, 0)
			} else {
				particle.update(c)
			}
		})
	}
}

export default Background
