export interface LazerCursorOptions {
  useDamping?: boolean
  followerTau?: number
}

export class LazerCursorEngine {
  private el: HTMLDivElement
  private state = {
    targetX: 0,
    targetY: 0,
    followerX: 0,
    followerY: 0,
    isDragging: false,
    pivotX: 0,
    pivotY: 0,
    lastMoveX: 0,
    lastMoveY: 0,
    currentRotation: 0,
    targetRotation: 0,
    rotationVelocity: 0,
    currentScale: 1,
    targetScale: 1,
    scaleVelocity: 0,
  }
  private rafId?: number
  private lastTs: number | null = null
  private opts: Required<LazerCursorOptions>

  constructor(el: HTMLDivElement, opts?: LazerCursorOptions) {
    this.el = el
    this.opts = {
      useDamping: opts?.useDamping ?? true,
      followerTau: opts?.followerTau ?? 160,
    }
    this.bind()
    this.loop = this.loop.bind(this)
    this.rafId = requestAnimationFrame(this.loop)
  }

  private bind() {
    document.addEventListener("mousemove", this.onMouseMove)
    document.addEventListener("mousedown", this.onMouseDown)
    window.addEventListener("mouseup", this.onMouseUp)
    window.addEventListener("dragstart", e => e.preventDefault())
    document.addEventListener("contextmenu", e => e.preventDefault())
  }

  private onMouseMove = (e: MouseEvent) => {
    this.state.targetX = e.clientX
    this.state.targetY = e.clientY
    if (this.state.isDragging) {
      this.state.lastMoveX = e.clientX
      this.state.lastMoveY = e.clientY
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    this.state.isDragging = true
    this.state.pivotX = e.clientX
    this.state.pivotY = e.clientY
    this.state.lastMoveX = e.clientX
    this.state.lastMoveY = e.clientY
    this.state.targetScale = 0.8
    this.el.classList.add("pressed")
  }

  private onMouseUp = () => {
    this.state.isDragging = false
    this.state.targetScale = 1
    this.state.targetRotation = 0
    this.el.classList.remove("pressed")
  }

  private loop(ts: number) {
    const { useDamping, followerTau } = this.opts
    const s = this.state
    const dt = this.lastTs == null ? 16.7 : Math.max(0.001, Math.min(100, ts - this.lastTs))
    this.lastTs = ts
    const k = useDamping ? 1 - Math.exp(-dt / followerTau) : 1
    s.followerX += (s.targetX - s.followerX) * k
    s.followerY += (s.targetY - s.followerY) * k

    if (s.isDragging) {
      const distance = Math.hypot(s.lastMoveX - s.pivotX, s.lastMoveY - s.pivotY)
      if (distance > 80) {
        const offsetX = s.lastMoveX - s.pivotX
        const offsetY = s.lastMoveY - s.pivotY
        let degrees = Math.atan2(-offsetX, offsetY) * (180 / Math.PI) + 24.3
        let diff = (degrees - s.currentRotation) % 360
        if (diff < -180) diff += 360
        if (diff > 180) diff -= 360
        s.targetRotation = s.currentRotation + diff
      }
      if (distance > 60) {
        s.pivotX += (s.lastMoveX - s.pivotX) * 0.04
        s.pivotY += (s.lastMoveY - s.pivotY) * 0.04
      }
    }

    const stiffness = 0.009
    const damping = 0.075
    const rotationForce = (s.targetRotation - s.currentRotation) * stiffness
    s.rotationVelocity += rotationForce
    s.rotationVelocity *= (1 - damping)
    if (Math.abs(s.rotationVelocity) < 1.0) {
      const friction = 0.01 * Math.sign(s.rotationVelocity)
      s.rotationVelocity -= friction
    }
    s.currentRotation += s.rotationVelocity

    const scaleForce = (s.targetScale - s.currentScale) * 0.1
    s.scaleVelocity += scaleForce
    s.scaleVelocity *= 0.65
    s.currentScale += s.scaleVelocity

    this.el.style.transform = `translate3d(${s.followerX}px, ${s.followerY}px,0) rotate(${s.currentRotation}deg) scale(${s.currentScale})`

    this.rafId = requestAnimationFrame(this.loop)
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    document.removeEventListener("mousemove", this.onMouseMove)
    document.removeEventListener("mousedown", this.onMouseDown)
    window.removeEventListener("mouseup", this.onMouseUp)
  }
}
