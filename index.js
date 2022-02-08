import Board from './Board.js'
import Player from './Player.js'
import Invader from './Invader.js'
import Grid from './Grid.js'

import Controls from './Controls.js'
;(() => {
	const canvas = document.querySelector('canvas')
	const c = canvas.getContext('2d')

	canvas.width = innerWidth
	canvas.height = innerHeight

	const player = new Player(canvas)
	const grids = [new Grid(canvas)]
	const projectiles = []
	const controls = new Controls(player, projectiles)

	addEventListener('resize', () => {
		player.redrawOnResize(canvas)
	})

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

		grids.forEach((grid) => {
			grid.update(canvas)
			grid.invaders.forEach((invader) => {
				invader.update(c, { velocity: grid.velocity })
			})
		})
	}

	animate()
})()
