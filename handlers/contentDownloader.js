const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const sharp = require('sharp');

const download = require('image-downloader');
let index = 0;

async function imgDownloader(content) {
    const arrayOfperiods = content.continuista

    fs.stat(`./tmp/${content.vidName}`, (err) => {
        if (!err) {
            fs.rmSync(`./tmp/${content.vidName}`, { recursive: true, force: true })
            fs.mkdirSync(`./tmp/${content.vidName}`, { force: true })
        } else {
            fs.mkdirSync(`./tmp/${content.vidName}`, { force: true })
        }
    })

    return await Promise.all(arrayOfperiods.map(async (period) => {
        console.log(period.meta)
        const resArr = []
        let done = false

        // setTimeout(() => {
        //     console.log('merda')
        //     if (!done) return resArr
        // }, 1.2 * 1000 * 60); //1 minutos e 12 segundos

        fs.stat(`./tmp/${content.vidName}/${period.meta}`, (err) => {
            if (!err) {
                fs.rmSync(`./tmp/${content.vidName}/${period.meta}`, { recursive: true, force: true })
                fs.mkdirSync(`./tmp/${content.vidName}/${period.meta}`, { force: true })
            } else {
                fs.mkdirSync(`./tmp/${content.vidName}/${period.meta}`, { force: true })
            }
        })



        if (period.images.length === 0) {
            console.log(period.imagesm, "puta merda junin")
            return { meta: period.meta, arr: null }
        }

        let i = 0
        return new Promise(async (res) => {
            for (const image of period.images) {
                i++
                if (image) {
                    const options = {
                        url: image.url[0],
                        dest: path.resolve('tmp', content.vidName, period.meta, `original${period.meta}(${index}).png`),               // will be saved to /path/to/dest/image.jpg
                    };
                    index++

                    const downloadedImg = await download.image(options).catch((e) => {
                        console.log('download err')
                    })

                    if (downloadedImg) {
                        setTimeout(() => {
                            res({ meta: period.meta, arr: null })
                        }, 0.5 * 1000 * 60)

                        sharp(downloadedImg.filename)
                            .resize(960, 540)
                            .toFile(downloadedImg.filename.replace('original', 'converted'), (err, info) => {
                                if (err) { console.log('error', period.meta) } else {
                                    const resObj = { filename: downloadedImg.filename.replace('original', 'converted'), startTime : image.startTime}
                                    resArr.push(resObj)
                                }
                            });
                    }


                }
                if (i == period.images.length) {
                    console.log(period.meta)
                    res({ meta: period.meta, arr: resArr })
                }
            }
        })
    }))
}

async function audioDld(url) {
    const path = './tmp/'
    try {
        const info = await ytdl.getInfo(url)
        const filename = `${info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`
        const filepath = path + filename
        const download = ytdl(url, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(filepath));

        return new Promise((resolve) => {
            download.on("finish", () => { resolve({ filepath, filename }) })
        })

    } catch (err) {
        console.log(err)
    }
}



module.exports = { audioDld, imgDownloader }