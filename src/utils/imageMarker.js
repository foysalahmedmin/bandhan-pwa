export const imageMarker = async ({ url, texts = [], options = {} }) => {
  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (texts?.length > 0) {
      const {
        font = "16px Arial",
        color = "white",
        outlineColor = "black",
        outlineWidth = 2,
        backgroundColor = "rgba(0, 0, 0, 0.7)",
        padding = 10,
        lineHeight = 20,
        textAlign = "center",
        textBaseline = "middle",
      } = options;

      ctx.font = font;
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;

      const textBlockHeight = texts.length * lineHeight + padding * 2;
      const textYStart = canvas.height - textBlockHeight - padding;

      const textMetrics = texts.map((text) => ctx.measureText(text));
      const maxWidth = Math.max(...textMetrics.map((m) => m.width));
      const bgWidth = maxWidth + padding * 2;

      const bgXMap = {
        left: padding,
        center: (canvas.width - bgWidth) / 2,
        right: canvas.width - bgWidth - padding,
        start: padding,
        end: canvas.width - bgWidth - padding,
      };

      const bgX = bgXMap[textAlign] || padding;

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(bgX, textYStart, bgWidth, textBlockHeight);
      }

      texts.forEach((text, index) => {
        const yPosition =
          textYStart + padding + index * lineHeight + lineHeight / 2;

        const xPositionMap = {
          left: padding,
          center: canvas.width / 2,
          right: canvas.width - padding,
          start: padding,
          end: canvas.width - padding,
        };

        const xPosition = xPositionMap[textAlign] || padding;

        if (outlineWidth > 0) {
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = outlineWidth;
          ctx.strokeText(text, xPosition, yPosition);
        }

        ctx.fillStyle = color;
        ctx.fillText(text, xPosition, yPosition);
      });
    }

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error marking image:", error);
    return undefined;
  }
};
