export default function imageReader(imageData, fieldName) {
  if (imageData[fieldName] && imageData[fieldName].data) {
    // console.log(`imageData[${fieldName}] `, imageData[fieldName]);
    const buffer = imageData[fieldName].data.data;
    let binary = '';
    binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64String = window.btoa(binary);
    return `data:${imageData[fieldName].contentType};base64,${base64String}`
  }
}

export function multipleImageReader(imgArr) {
  return imgArr.map((imgData) => {
    if (imgData && imgData.data) {
      // console.log(`imgData `, imgData);
      const buffer = imgData.data.data;
      let binary = '';
      binary = String.fromCharCode(...new Uint8Array(buffer));
      const base64String = window.btoa(binary);
      return `data:${imgData.contentType};base64,${base64String}`
    }
  })
}