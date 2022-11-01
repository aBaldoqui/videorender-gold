const ae = require('after-effects')
const path = require('path')
const { getVideoDurationInSeconds } = require('get-video-duration')
// const fs = require('fs').promises

//https://ae-scripting.docsforadobe.dev/other/importoptions.html#importoptions

async function index(contentObj, audioFileName, arrOfLocalImgs, bg, vidBg) {
    try {
        console.log(arrOfLocalImgs)

        const backgroundFile = path.resolve('templates', `background-${bg}.mp4`)

        const videoDuration = await getVideoDurationInSeconds(`./tmp/${audioFileName.filename}`)

        console.log('inciando ae')

        ae.execute((contentObj, audioFileName, videoDuration, arrOfLocalImgs, backgroundFile, vidBg) => {
            try {
                const audioFile = `~/Documents/dev/videorender-gold/tmp/${audioFileName.filename}`;

                const projectName = contentObj.vidName;
                const outputFolder = "~/Desktop";
                const importAudioOptions = new ImportOptions();

                const comp = app.project.items.addComp(projectName, 1920, 1080, 1, videoDuration, 60);

                if (vidBg) {
                    const vidFile = `~/Documents/dev/videorender-gold/tmp/${vidBg.filename}`;
                    const bgvideo = app.project.importFile(new ImportOptions(new File(vidFile)));
                    comp.layers.add(bgvideo);

                } else {
                    const background = app.project.importFile(new ImportOptions(new File(backgroundFile)))
                    comp.layers.add(background);
                }

                importAudioOptions.file = new File(audioFile);

                const audio = app.project.importFile(importAudioOptions);



                let index = 0
                arrOfLocalImgs.forEach(period => {
                    if (!period.arr) {
                        index++
                        return
                    }

                    period.arr.forEach(imageFile => {
                        if (imageFile != null) {
                            const importImgOptions = new ImportOptions();
                            importImgOptions.file = new File(`${imageFile.filename}`);
                            const img = app.project.importFile(importImgOptions);
                            if (img) {
                                const newLayer = comp.layers.add(img)

                                let per0;
                                let per1;

                                per0 = parseFloat(imageFile.startTime.replace('s', ''))

                                per1 = per0 + Math.random() * (4 - 2) + 2

                                newLayer.inPoint = per0
                                newLayer.outPoint = per1

                                newLayer.transform.position.setValue([Math.random() * (1400 - 500) + 500, Math.random() * (800 - 300) + 300])
                                // alert(newLayer.property("Position"))
                                newLayer.transform.rotation.setValue(Math.random() * (10 - -10) + -10)
                                // alert(newLayer.Transform.Orientation.Position)
                            };
                            // alert(img.duration)
                        }
                    })
                    index++
                });

                const rendering = app.project.renderQueue.items.add(comp);
                const outputModule = rendering.outputModule(1);

                outputModule.applyTemplate("Qualidade superior")
                outputModule.file = File(outputFolder + '/' + comp.name)

                comp.layers.add(audio);

                app.project.renderQueue.queueInAME(true)
            } catch (err) {
                alert(err)
            }

        }, contentObj, audioFileName, videoDuration, arrOfLocalImgs, backgroundFile, vidBg);
    } catch (err) {
        console.log(err)
    }
}





module.exports = index