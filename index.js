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
	const grids = []
	const projectiles = []
	const controls = new Controls(player, projectiles)

	addEventListener('resize', () => {
		player.redrawOnResize(canvas)
	})

	let frames = 0
	let randomInterval = Math.floor(Math.random() * 500 + 500)

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

		// Spawing enemies
		if (frames % randomInterval === 0) {
			// Divisible by 1000
			grids.push(new Grid(canvas))
			randomInterval = Math.floor(Math.random() * 500 + 500)
			frames = 0
		}

		frames++
	}

	animate()
})()
