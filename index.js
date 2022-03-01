import Board from './js/Board.js'
import Player from './js/Player.js'
import Grid from './js/Grid.js'
import Particle from './js/Particle.js'
import PowerUp from './js/PowerUp.js'
import UFO from './js/UFO.js'

import Background from './js/Background.js'

import Controls from './js/Controls.js'
import { Sound } from './js/Sound.js'
import Bomb from './js/Bomb.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
;(() => {
	const scoreEl = document.getElementById('scoreEl')

	// canvas.width = innerWidth
	// canvas.height = innerHeight
	const cWidth = (canvas.width = 1024)
	const cHeight = (canvas.height = 576)

	let game = {
		over: false,
		active: true,
	}
	let score = 0

	const invaderHitSound = new Sound('./sound/invaderHit.wav')
	let shipExplosionSound = new Sound('./sound/ship-explosion.wav')

	const startSound = new Sound('./sound/start.wav')
	startSound.volume(0.4)
	// startSound.play()

	const bgMusic = new Sound('./sound/bgMusic.wav')
	bgMusic.volume(0.1)
	// bgMusic.loop()
	// bgMusic.play()

	const player = new Player(canvas)
	const grids = []
	const projectiles = []
	const controls = new Controls(player, game)
	const invaderProjectiles = []
	const particles = []
	const bombs = []
	const powerUps = []

	// addEventListener('resize', () => {
	// 	player.redrawOnResize(canvas)
	// })

	addEventListener('timeupdate', function () {
		console.log(currentTime)
	})

	let frames = 0
	let randomInterval = Math.floor(Math.random() * 500 + 500)

	const background = new Background(canvas)

	// background.createBGStars(canvas)

	function createParticles({ object, fades, color = '#BAA0DE' }) {
		for (let i = 0; i < 15; i++) {
			particles.push(
				new Particle({
					position: {
						x: object.position.x + object.width / 2,
						y: object.position.y + object.height / 2,
					},
					velocity: {
						x: (Math.random() - 0.5) * 2,
						y: (Math.random() - 0.5) * 2,
					},
					radius: Math.random() * 3,
					color,
					fades,
				}),
			)
		}
	}

	function createScoreLabel({ score = 100, object }) {
		const scoreLabel = document.createElement('label')
		scoreLabel.innerHTML = score
		scoreLabel.style.position = 'absolute'
		scoreLabel.style.color = 'white'
		// set score position to invader that was destroyed
		scoreLabel.style.top = object.position.y + 'px'
		scoreLabel.style.left = object.position.x + 'px'
		scoreLabel.style.userSelect = 'none'

		// add score
		const gameBoard = document.querySelector('#game-board')
		gameBoard.appendChild(scoreLabel)

		gsap.to(scoreLabel, {
			opacity: 0,
			y: -30,
			duration: 0.9,
			onComplete: () => {
				gameBoard.removeChild(scoreLabel)
			},
		})
	}

	const ufo = new UFO({
		position: {
			x: 0,
			y: 300,
		},
	})

	function animate() {
		if (!game.active) return
		requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)

		PowerUp.remove(c, canvas, powerUps)

		PowerUp.spawn(frames, powerUps)

		ufo.update(c, cWidth, {
			velocity: {
				x: 2,
				y: 0,
			},
		})

		// Spawn bombs
		if (frames % 200 === 0 && bombs.length < 3) {
			bombs.push(
				new Bomb({
					canvas: { cWidth, cHeight },
					velocity: {
						x: (Math.random() - 0.5) * 6,
						y: (Math.random() - 0.5) * 6,
					},
				}),
				new Bomb({
					canvas: { cWidth, cHeight },
					velocity: {
						x: Math.random() - 0.5 * 6,
						y: Math.random() - 0.5 * 6,
					},
				}),
			)
		}

		// Remove Bombs
		for (let i = bombs.length - 1; i >= 0; i--) {
			const bomb = bombs[i]
			if (bomb.opacity <= 0) {
				bombs.splice(i, 1)
			}
			bomb.update(c, cWidth, cHeight)
		}

		player.update(c)

		//TODO:
		controls.handleKeyPress(canvas, player, projectiles)

		invaderProjectiles.forEach((invaderProjectile, index) => {
			// remove invaders that go off screen
			if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
				setTimeout(() => {
					invaderProjectiles.splice(index, 1)
				}, 0)
			} else invaderProjectile.update(c)

			// projectile hits player
			if (
				invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
				invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
				invaderProjectile.position.x <= player.position.x + player.width
			) {
				setTimeout(() => {
					invaderProjectiles.splice(index, 1)
					player.opacity = 0
					game.over = true
				}, 0)

				setTimeout(() => {
					game.active = false
				}, 2000)

				// Show player ship explosion
				createParticles({ object: player, color: 'white', fades: true })

				shipExplosionSound.volume(0.2)
				shipExplosionSound.play()
				setTimeout(() => {
					shipExplosionSound = null
				}, 2000)

				bgMusic.stop()
			}
		})

		// REMOVE PROJECTILE after it hits a bomb
		for (let i = projectiles.length - 1; i >= 0; i--) {
			const projectile = projectiles[i]

			for (let j = bombs.length - 1; j >= 0; j--) {
				const bomb = bombs[j]
				//	if projectile hits bomb, remove it
				if (
					Math.hypot(projectile.position.x - bomb.position.x, projectile.position.y - bomb.position.y) < projectile.radius + bomb.radius &&
					!bomb.active
				) {
					projectiles.splice(i, 1)
					bomb.explode()
				}
			}

			// Activate machine gun
			PowerUp.activate(player, projectile, projectiles, powerUps, i)

			// remove projectiles
			if (projectile.position.y + projectile.radius <= 0) {
				projectiles.splice(i, 1)
			} else {
				// update projectile position
				projectile.update(c)
			}
		}

		// Updating enemy grids
		grids.forEach((grid, gridIdx) => {
			grid.update(canvas)

			// Spawning invader invaderProjectiles
			let randomInvader = Math.floor(Math.random() * grid.invaders.length)
			if (frames % 100 === 0 && grid.invaders.length > 0) {
				grid.invaders[randomInvader].shoot(invaderProjectiles)
			}

			// start grid loop
			for (let i = grid.invaders.length - 1; i >= 0; i--) {
				const invader = grid.invaders[i]
				invader.update(c, { velocity: grid.velocity })

				//	handleParticleHitsBomb(invader)

				const invaderRadius = 15

				for (let j = bombs.length - 1; j >= 0; j--) {
					const bomb = bombs[j]
					//	if bomb hits invaders, remove them
					if (
						Math.hypot(invader?.position?.x - bomb.position.x, invader?.position?.y - bomb.position.y) < invaderRadius + bomb.radius &&
						bomb.active
					) {
						score += 50
						scoreEl.innerHTML = score

						grid.invaders.splice(i, 1)
						createScoreLabel({ object: invader, score: 50 })

						createParticles({
							object: invader,
							fades: true,
						})
						bomb.explode()
					}
				}

				// projectiles hit enemy
				projectiles.forEach((projectile, j) => {
					if (
						projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
						projectile.position.x + projectile.radius >= invader.position.x &&
						projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
						projectile.position.y + projectile.radius > invader.position.y
					) {
						setTimeout(() => {
							// check if invader and projectile can be found in array
							const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
							const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)

							// Hit Enemy! -> remove invader and projectile
							if (invaderFound && projectileFound) {
								// set off explosion for invader hit
								score += 8
								scoreEl.innerText = score

								// dynamic score labels
								createScoreLabel({ object: invader })

								createParticles({
									object: invader,
									fades: true,
								})

								// explosion sound

								invaderHitSound.volume(0.2)
								invaderHitSound.play()

								grid.invaders.splice(i, 1)
								projectiles.splice(j, 1)

								// update the grid width when invaders are removed, so back and forth movement matches with the grid width
								if (grid.invaders.length > 0) {
									const firstInvader = grid.invaders[0]
									const lastInvader = grid.invaders[grid.invaders.length - 1]

									grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
									grid.position.x = firstInvader.position.x
								} else {
									grids.splice(gridIdx, 1)
								}
							}
						}, 0)
					}
				})
			}
		})

		// Spawn invaders
		if (frames % randomInterval === 0) {
			// Divisible by 1000
			grids.push(new Grid(canvas))
			randomInterval = Math.floor(Math.random() * 150 + 100)
		}

		console.log(controls.keys.space.pressed)
		controls.selectGun(frames, player, projectiles)

		background.updateBGStars(canvas)

		frames++
	}
	animate()
})()
