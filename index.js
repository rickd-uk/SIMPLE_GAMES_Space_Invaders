import Player from './Player.js'
import Controls from './Controls.js'
import Projectile from './Projectile.js'
;(() => {
	const canvas = document.querySelector('canvas')
	const c = canvas.getContext('2d')

	canvas.width = innerWidth
	canvas.height = innerHeight

	const player = new Player(canvas)
	const controls = new Controls()

	function animate() {
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)
		player.update(c)
		controls.handleKeyPress(canvas, player)
	}

	addEventListener('resize', () => {
		player.redrawOnResize(canvas)
	})
	animate()
})()
