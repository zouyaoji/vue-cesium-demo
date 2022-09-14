import * as mediaformat from './mediaformat'
import * as MediaFactory from './mediastream-factory'

const quickScan = [
  {
    label: '4K(UHD)',
    width: 3840,
    height: 2160
  },
  {
    label: '1080p(FHD)',
    width: 1920,
    height: 1080
  },
  {
    label: 'UXGA',
    width: 1600,
    height: 1200,
    ratio: '4:3'
  },
  {
    label: '720p(HD)',
    width: 1280,
    height: 720
  },
  {
    label: 'SVGA',
    width: 800,
    height: 600
  },
  {
    label: 'VGA',
    width: 640,
    height: 480
  },
  {
    label: '360p(nHD)',
    width: 640,
    height: 360
  },
  {
    label: 'CIF',
    width: 352,
    height: 288
  },
  {
    label: 'QVGA',
    width: 320,
    height: 240
  },
  {
    label: 'QCIF',
    width: 176,
    height: 144
  },
  {
    label: 'QQVGA',
    width: 160,
    height: 120
  }
]

export default function GetSupportCameraResolutions() {
  return new Promise(function (resolve, reject) {
    const resolutions = []
    let ok = 0
    let err = 0
    for (let i = 0; i < quickScan.length; ++i) {
      const videoConstraints = new MediaFactory.VideoTrackConstraints(mediaformat.VideoSourceInfo.CAMERA)
      videoConstraints.resolution = new mediaformat.Resolution(quickScan[i].width, quickScan[i].height)

      MediaFactory.MediaStreamFactory.createMediaStream(new MediaFactory.StreamConstraints(false, videoConstraints))
        .then(stream => {
          resolutions.push(quickScan[i])
          ok++
          if (ok + err == quickScan.length) {
            resolve(resolutions)
          }
        })
        .catch(e => {
          err++
          if (ok + err == quickScan.length) {
            resolve(resolutions)
          }
        })
    }
  })
}

export function GetAllScanResolution() {
  return quickScan
}
export function isSupportResolution(w, h) {
  return new Promise(function (resolve, reject) {
    const videoConstraints = new MediaFactory.VideoTrackConstraints(mediaformat.VideoSourceInfo.CAMERA)
    videoConstraints.resolution = new mediaformat.Resolution(w, h)

    MediaFactory.MediaStreamFactory.createMediaStream(new MediaFactory.StreamConstraints(false, videoConstraints))
      .then(stream => {
        resolve(true)
      })
      .catch(e => {
        reject(e)
      })
  })
}
