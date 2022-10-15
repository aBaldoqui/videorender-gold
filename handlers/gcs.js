const { Storage } = require('@google-cloud/storage')
const bucketName = "audios-videomaker";

const storage = new Storage({
    keyFilename: './keys/videomaker-363718-5493f7068694.json'
})

async function contentDownloader(filename) {
    return new Promise(async res=>{
        const obj = await storage.bucket(bucketName).file(filename).download()
        const jsonobj = await JSON.parse(obj)
        res(jsonobj)
    })
    
}


module.exports = { contentDownloader }