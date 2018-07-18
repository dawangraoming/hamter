/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/7/8
 */

// import * as Jimp from 'jimp';
import {stat, createReadStream, createWriteStream, writeFile} from 'fs';
import {promisify} from 'util';
import * as fileType from 'file-type';
import * as readChunk from 'read-chunk';
import * as PSD from 'psd';
import {FileTypeResult} from 'file-type';


interface GetImageDataReturn {
  width: number;
  height: number;
  size: number;
  time: number;
}

export async function getSizeAndTime(path: string) {
  const data = await promisify(stat)(path);
  return {
    birthTime: data.birthtimeMs,
    size: data.size
  };
}

/**
 * get image type include ext and mime
 * @param {string} path
 * @return {Promise<FileType.FileTypeResult>}
 */
export async function getImageType(path: string): Promise<FileTypeResult> {
  const chunk = await readChunk(path, 0, 4100);
  return fileType(chunk);
}

/**
 * convert base64 to file
 * @param {string} base64
 * @param {string} path
 * @return {Promise<any>}
 */
export async function convertBase64ToFile(base64: string, path: string): Promise<any> {
  const data = base64.replace(/^data:image\/\w+;base64,/, '');
  const bufferData = new Buffer(data, 'base64');
  return promisify(writeFile)(path, bufferData);
}


/**
 * convert psd file to png
 * @param {string} sourcePath
 * @param {string} writePath
 * @return {Promise<any>}
 */
export async function convertPsdToPng(sourcePath: string, writePath: string): Promise<any> {
  return PSD.open(sourcePath).then(psd => psd.image.saveAsPng(writePath));
}


/**
 * get a image's width, height, file size, and create time(birth time).
 * @param {string} sourcePath
 * @return {Promise<GetImageDataReturn>}
 */
// export async function getImageData(sourcePath: string): Promise<GetImageDataReturn> {
//   // use jimp to get the image pixel's width and height
//   const pixel = Jimp.read(sourcePath).then(lenna => {
//     return {
//       width: lenna.bitmap.width,
//       height: lenna.bitmap.height
//     };
//   });
//   // use promisify to change node callback to promise
//   const sizePromise = promisify(stat)(sourcePath);
//   const data = await Promise.all([sizePromise, pixel]);
//
//   return {
//     size: data[0].size,
//     time: Math.floor(data[0].birthtimeMs),
//     width: data[1].width,
//     height: data[1].height
//   };
// }

/**
 * copy file to other path;
 * @param {string} sourcePath
 * @param {string} writePath
 * @return {Promise<any>}
 */
export function fileCopy(sourcePath: string, writePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const read = createReadStream(sourcePath).on('error', reject);
    const write = createWriteStream(writePath).on('error', reject);
    read.pipe(write).on('end', () => {
      write.end();
      resolve();
    });
  });
}

/**
 * generate a thumb from the image
 * @param {string | Promise<Jimp.Jimp>} sourcePath
 * @param {string} writePath
 * @return {Promise<Jimp.Jimp>}
 */
// export function generateThumb(sourcePath: string | Promise<Jimp>, writePath: string): Promise<Jimp> {
//   let process;
//   // polymorphism params, support string path or promise object
//   if (typeof sourcePath === 'string') {
//     process = Jimp.read(sourcePath as string);
//   } else {
//     process = sourcePath;
//   }
//   // use jipm method to change the image size and quality and then write to file;
//   return process.then(lenna => {
//     return lenna.resize(480, Jimp.AUTO).quality(60).write(writePath);
//   });
// }
