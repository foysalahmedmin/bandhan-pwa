export const markImage = async ({
  uri,
  name,
  outletCode,
  outletName,
  location,
  userInfo,
}) => {
  try {
    const image = new Image();
    image.src = uri;

    // Ensure the image loads before processing
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    // Create a canvas and draw the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Add watermark text
    ctx.font = "15px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; // White text with transparency
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textLines = [
      `TMS: ${userInfo.name}`,
      `Outlet Code: ${outletCode}`,
      `Outlet Name: ${outletName}`,
      `Territory: ${userInfo?.territory[0]?.name}`,
      `Latitude: ${location?.latitude} Longitude: ${location?.longitude}`,
      `Date: ${new Date().toISOString().replace("T", " ").split(".")[0]}`,
    ];

    const lineHeight = 20; // Spacing between lines
    const startY = canvas.height - (textLines.length * lineHeight + 10); // Start 10px above bottom
    textLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    // Convert canvas to data URL
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error marking image:", error);
  }
};
