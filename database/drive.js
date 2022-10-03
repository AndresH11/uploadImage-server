const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

//Configurando google drive api
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);

oauth2Client.setCredentials({refresh_token : REFRESH_TOKEN});

const drive = google.drive({
  version : 'v3',
  auth : oauth2Client
});
// Fin de configuracion google drive api

//obtener la url

const setFilePublic = async(fileId)=>{
  try {
    await drive.permissions.create({
      fileId,
      requestBody : {
        role : 'reader',
        type : 'anyone'
      }
    });

    const getUrl = await drive.files.get({
      fileId,
      fields : 'webViewLink, webContentLink'
    });

    return getUrl;
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  //subir una imagen
  uploadImage :  async({shared},mimetype,ext,photo)=>{
    try {
      const createFile = await drive.files.create({
        requestBody : {
          name : `${uuidv4()}${ext}`,
          mimeType : mimetype
        },
        media : {
          mimeType : mimetype,
          body : photo
        },
      });
  
      const fileId = createFile.data.id;
      const getUrl = await setFilePublic(fileId);

      return getUrl.data;
  
    } catch (error) {
      console.log(error);
    }
  }
}