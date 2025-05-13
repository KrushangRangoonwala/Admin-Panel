export default function imageReader(imageData) {
  if (imageData?.image) {
    const buffer = imageData.image.data.data;
    let binary = '';
    binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64String = window.btoa(binary);
    return `data:${imageData.image.contentType};base64,${base64String}`
  }
}