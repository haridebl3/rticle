const Cloud = require("@google-cloud/storage");

const { Storage } = Cloud;
const gc = new Storage({
  projectId: "rticle",
  scopes: "https://www.googleapis.com/auth/cloud-platform",
  credentials: {
    client_email: process.env.GOOGLE_STORAGE_EMAIL,
    private_key: process.env.GCD_Service_Key,
  },
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
        console.log(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

module.exports = { uploadImage: uploadImage };
