export class Sound {
	constructor(src) {
		this.sound = document.createElement('audio')
		this.sound.src = src
		this.sound.setAttribute('preload', 'auto')
		this.sound.setAttribute('controls', 'none')
		this.sound.style.display = 'none'
		this.sound.volume
		document.body.appendChild(this.sound)
		this.play = function () {
			this.sound.play()
			this.sound.volume = 0.3
		}
		this.stop = function () {
			this.sound.pause()
		}
		this.volume = (val) => {
			this.sound.volume = val
		}
		this.loop = () => {
			this.sound.loop = true
		}
		this.getDuration = () => {
			return this.sound.duration
		}
	}
}
