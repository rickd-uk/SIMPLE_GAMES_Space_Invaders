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

		// Updating enemy grids
		grids.forEach((grid) => {
			grid.update(canvas)
			grid.invaders.forEach((invader, iIdx) => {
				invader.update(c, { velocity: grid.velocity })

				// Collision detection for projectile firing at invader
				projectiles.forEach((projectile, pIdx) => {
					if (
						projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
						projectile.position.x + projectile.radius >= invader.position.x &&
						projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
						projectile.position.y + projectile.radius > invader.position.y
					) {
						setTimeout(() => {
							const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
							const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)
							if (invaderFound && projectileFound) {
								grid.invaders.splice(iIdx, 1)
								projectiles.splice(pIdx, 1)
							}
						}, 0)
					}
				})
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
