import Resizer from "react-image-file-resizer";

export function isColorDark(color) {
  const rgb = parseInt(color?.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 160;
}

export function deduceColor(color) {
  return isColorDark(color) ? "white" : "black";
}

export const compressImage = async (file) =>
  await new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      100,
      100,
      "WEBP",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

  export const qrCodeFormats = ['aztec' ,
    'code_128' ,
    'code_39' ,
    'code_93' ,
    'codabar' ,
    'databar' ,
    'databar_expanded' ,
    'data_matrix' ,
    'dx_film_edge' ,
    'ean_13' ,
    'ean_8' ,
    'itf' ,
    'maxi_code' ,
    'micro_qr_code' ,
    'pdf417' ,
    'qr_code' ,
    'rm_qr_code' ,
    'upc_a' ,
    'upc_e' ,
    'linear_codes' ,
    'matrix_codes' ,
    'unknown']