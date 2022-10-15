const handlers = require('../handlers/index')
const readlinesync = require('readline-sync')

const inputFileName = readlinesync.question('file name: ')
const bg = readlinesync.question('background template: ')
//const inputFileName = 'neurocie.json'
async function index() {
    try {
        const content = await handlers.gcs.contentDownloader(inputFileName)
        const fileOutput = await handlers.contentDownloader.audioDld(content.vidUrl)
        await handlers.contentDownloader.imgDownloader(content.continuista).then(res => {
            console.log('?')
            handlers.vidcreate(content, fileOutput, res, bg)
        })

    } catch (err) {
        console.log(err)
    }
}
index()