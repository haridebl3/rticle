const Cloud = require("@google-cloud/storage");
const serviceKey = process.env.GCD_Service_Key;

const { Storage } = Cloud;
const gc = new Storage({
  keyFilename: serviceKey,
  projectId: "rticle",
});

const bucket = gc.bucket("rticle");

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

module.exports = uploadImage;
