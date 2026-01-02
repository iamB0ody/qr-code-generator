class QRCodeGenerator {
  constructor() {
    this.canvas = document.getElementById("qr-canvas")
    this.ctx = this.canvas.getContext("2d")
    this.placeholder = document.getElementById("qr-placeholder")
    this.currentQRData = null
    this.iconImage = null

    this.initializeEventListeners()
    this.updateRangeValues()
  }

  initializeEventListeners() {
    // Generate button
    document.getElementById("generate-btn").addEventListener("click", () => {
      this.generateQRCode()
    })

    // Download button
    document.getElementById("download-btn").addEventListener("click", () => {
      this.downloadQRCode()
    })

    // Range inputs with live updates
    const rangeInputs = ["qr-size", "margin", "icon-size", "border-radius", "border-width"]
    rangeInputs.forEach((id) => {
      const input = document.getElementById(id)
      input.addEventListener("input", () => {
        this.updateRangeValue(id)
        if (this.currentQRData) {
          this.generateQRCode()
        }
      })
    })

    // Color inputs with live updates
    const colorInputs = ["foreground-color", "background-color", "border-color"]
    colorInputs.forEach((id) => {
      document.getElementById(id).addEventListener("change", () => {
        if (this.currentQRData) {
          this.generateQRCode()
        }
      })
    })

    // Other inputs with live updates
    const liveUpdateInputs = ["error-correction", "border-style", "shadow"]
    liveUpdateInputs.forEach((id) => {
      document.getElementById(id).addEventListener("change", () => {
        if (this.currentQRData) {
          this.generateQRCode()
        }
      })
    })

    // Icon upload
    document.getElementById("icon-upload").addEventListener("change", (e) => {
      this.handleIconUpload(e)
    })

    // Text input with debounced updates
    let textTimeout
    document.getElementById("qr-text").addEventListener("input", () => {
      clearTimeout(textTimeout)
      textTimeout = setTimeout(() => {
        if (this.currentQRData) {
          this.generateQRCode()
        }
      }, 500)
    })
  }

  updateRangeValues() {
    const ranges = [
      { id: "qr-size", suffix: "px" },
      { id: "margin", suffix: "" },
      { id: "icon-size", suffix: "%" },
      { id: "border-radius", suffix: "px" },
      { id: "border-width", suffix: "px" },
    ]

    ranges.forEach((range) => {
      this.updateRangeValue(range.id, range.suffix)
    })
  }

  updateRangeValue(id, suffix = "") {
    const input = document.getElementById(id)
    const valueSpan = document.getElementById(`${id}-value`)
    if (valueSpan) {
      valueSpan.textContent = input.value + suffix
    }
  }

  async generateQRCode() {
    const text = document.getElementById("qr-text").value.trim()
    if (!text) {
      alert(window.i18n ? window.i18n.t("alert.emptyContent") : "Please enter some content for the QR code")
      return
    }

    try {
      // Create QR code using the working library
      const qrDiv = document.createElement("div")
      const qr = new QRCode(qrDiv, {
        text: text,
        width: parseInt(document.getElementById("qr-size").value),
        height: parseInt(document.getElementById("qr-size").value),
        colorDark: document.getElementById("foreground-color").value,
        colorLight: document.getElementById("background-color").value,
        correctLevel: this.getErrorCorrectionLevel(),
        margin: parseInt(document.getElementById("margin").value),
      })

      // Wait for QR code to render
      setTimeout(() => {
        const qrImg = qrDiv.querySelector("img")
        if (qrImg) {
          this.drawQRCodeWithStyling(qrImg)
          this.currentQRData = { text, qrDiv }
          this.placeholder.classList.add("hidden")
          document.getElementById("download-btn").disabled = false
        }
      }, 100)
    } catch (error) {
      console.error("Error generating QR code:", error)
      alert(window.i18n ? window.i18n.t("alert.generationError") : "Error generating QR code. Please check your input.")
    }
  }

  getErrorCorrectionLevel() {
    const level = document.getElementById("error-correction").value
    const levels = { L: 0, M: 1, Q: 2, H: 3 }
    return levels[level] || 1
  }

  drawQRCodeWithStyling(qrImg) {
    const size = parseInt(document.getElementById("qr-size").value)
    const borderRadius = parseInt(document.getElementById("border-radius").value)
    const borderWidth = parseInt(document.getElementById("border-width").value)
    const borderStyle = document.getElementById("border-style").value
    const borderColor = document.getElementById("border-color").value
    const hasShadow = document.getElementById("shadow").checked

    // Set canvas size
    this.canvas.width = size + borderWidth * 2
    this.canvas.height = size + borderWidth * 2

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Add shadow if enabled
    if (hasShadow) {
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      this.ctx.shadowBlur = 10
      this.ctx.shadowOffsetX = 5
      this.ctx.shadowOffsetY = 5
    }

    // Draw border if enabled
    if (borderStyle !== "none" && borderWidth > 0) {
      this.ctx.strokeStyle = borderColor
      this.ctx.lineWidth = borderWidth
      this.ctx.setLineDash(this.getLineDash(borderStyle))
      this.ctx.strokeRect(borderWidth / 2, borderWidth / 2, size, size)
    }

    // Reset shadow for main content
    this.ctx.shadowColor = "transparent"
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0

    // Draw QR code with border radius
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.roundRect(borderWidth, borderWidth, size, size, borderRadius)
    this.ctx.clip()

    this.ctx.drawImage(qrImg, borderWidth, borderWidth, size, size)
    this.ctx.restore()

    // Add icon if uploaded
    this.addIconIfExists()
  }

  getLineDash(style) {
    switch (style) {
      case "dashed":
        return [10, 5]
      case "dotted":
        return [2, 3]
      case "double":
        return [0]
      default:
        return []
    }
  }

  addIconIfExists() {
    if (!this.iconImage) return

    const size = parseInt(document.getElementById("qr-size").value)
    const iconSizePercent = parseInt(document.getElementById("icon-size").value)
    const iconSize = (size * iconSizePercent) / 100

    const x = (this.canvas.width - iconSize) / 2
    const y = (this.canvas.height - iconSize) / 2

    // Draw white background for icon
    this.ctx.fillStyle = "white"
    this.ctx.fillRect(x - 5, y - 5, iconSize + 10, iconSize + 10)

    // Draw icon
    this.ctx.drawImage(this.iconImage, x, y, iconSize, iconSize)
  }

  handleIconUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    const preview = document.getElementById("icon-preview")
    const reader = new FileReader()

    reader.onload = (e) => {
      this.iconImage = new Image()
      this.iconImage.onload = () => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Icon preview">`
        if (this.currentQRData) {
          this.generateQRCode()
        }
      }
      this.iconImage.src = e.target.result
    }

    reader.readAsDataURL(file)
  }

  downloadQRCode() {
    if (!this.currentQRData) return

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = this.canvas.toDataURL()
    link.click()
  }
}

// Initialize when page loads
$(document).ready(() => {
  new QRCodeGenerator()
})
