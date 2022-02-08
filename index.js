import Player from './Player.js'
import Controls from './Controls.js'
;(() => {
	const canvas = document.querySelector('canvas')
	const c = canvas.getContext('2d')

	canvas.width = innerWidth
	canvas.height = innerHeight

	const player = new Player(canvas)

	const projectiles = []
	const controls = new Controls(player, projectiles)

	function animate() {
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)
		player.update(c)
		controls.handleKeyPress(canvas, player)
		projectiles.forEach((projectile, index) => {
			if (projectile.position.y + projectile.radius <= 0) {
				setTimeout(() => {
					projectiles.splice(index, 1)
				}, 0)
			} else {
				projectile.update(c)
			}
		})
	}

	addEventListener('resize', () => {
		player.redrawOnResize(canvas)
	})
	animate()
})()
