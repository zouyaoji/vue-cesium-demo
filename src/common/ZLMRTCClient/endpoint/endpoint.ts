import { setLogger } from '../ulity/debug'
import * as debug from '../ulity/debug'
import Event from '../ulity/event'
import Events from '../base/event'
import axios from 'axios'
import * as Base from '../base/export'
import { AudioTrackConstraints, VideoTrackConstraints } from '../base/export'

export default class RTCEndpoint extends Event {
  TAG: string
  options: any
  e: {
    onicecandidate: (event: any) => void
    ontrack: (event: any) => void
    onicecandidateerror: (event: any) => void
    onconnectionstatechange: (event: any) => void
    ondatachannelopen: (event: any) => void
    ondatachannelmsg: (event: any) => void
    ondatachannelerr: (event: any) => void
    ondatachannelclose: (event: any) => void
  }
  _remoteStream: any
  _localStream: any
  pc: RTCPeerConnection
  datachannel: any
  constructor(options) {
    super('RTCPusherPlayer')
    this.TAG = '[RTCPusherPlayer]'

    const defaults = {
      element: '', // html video element
      debug: false, // if output debug log
      zlmsdpUrl: '',
      simulcast: false,
      useCamera: true,
      audioEnable: true,
      videoEnable: true,
      recvOnly: false,
      resolution: { w: 0, h: 0 },
      usedatachannel: false
    }

    this.options = Object.assign({}, defaults, options)

    if (this.options.debug) {
      setLogger()
    }

    this.e = {
      onicecandidate: this._onIceCandidate.bind(this),
      ontrack: this._onTrack.bind(this),
      onicecandidateerror: this._onIceCandidateError.bind(this),
      onconnectionstatechange: this._onconnectionstatechange.bind(this),
      ondatachannelopen: this._onDataChannelOpen.bind(this),
      ondatachannelmsg: this._onDataChannelMsg.bind(this),
      ondatachannelerr: this._onDataChannelErr.bind(this),
      ondatachannelclose: this._onDataChannelClose.bind(this)
    }

    this._remoteStream = null
    this._localStream = null

    this.pc = new RTCPeerConnection(null)

    this.pc.onicecandidate = this.e.onicecandidate
    this.pc.onicecandidateerror = this.e.onicecandidateerror
    this.pc.ontrack = this.e.ontrack
    this.pc.onconnectionstatechange = this.e.onconnectionstatechange

    this.datachannel = null
    if (this.options.usedatachannel) {
      this.datachannel = this.pc.createDataChannel('chat')
      this.datachannel.onclose = this.e.ondatachannelclose
      this.datachannel.onerror = this.e.ondatachannelerr
      this.datachannel.onmessage = this.e.ondatachannelmsg
      this.datachannel.onopen = this.e.ondatachannelopen
    }

    if (!this.options.recvOnly && (this.options.audioEnable || this.options.videoEnable)) this.start()
    else this.receive()
  }

  receive() {
    let audioTransceiver = null
    let videoTransceiver = null

    //debug.error(this.TAG,'this not implement');
    const AudioTransceiverInit: RTCRtpTransceiverInit = {
      direction: 'recvonly',
      sendEncodings: []
    }
    const VideoTransceiverInit: RTCRtpTransceiverInit = {
      direction: 'recvonly',
      sendEncodings: []
    }

    if (this.options.videoEnable) {
      videoTransceiver = this.pc.addTransceiver('video', VideoTransceiverInit)
    }
    if (this.options.audioEnable) {
      audioTransceiver = this.pc.addTransceiver('audio', AudioTransceiverInit)
    }

    this.pc
      .createOffer()
      .then(desc => {
        debug.log(this.TAG, 'offer:', desc.sdp)
        this.pc.setLocalDescription(desc).then(() => {
          axios({
            method: 'post',
            url: this.options.zlmsdpUrl,
            responseType: 'json',
            data: desc.sdp,
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            }
          }).then(response => {
            const ret = response.data //JSON.parse(response.data);
            if (ret.code != 0) {
              // mean failed for offer/anwser exchange
              this.dispatch(Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, ret)
              return
            }
            const anwser: any = {}
            anwser.sdp = ret.sdp
            anwser.type = 'answer'
            debug.log(this.TAG, 'answer:', ret.sdp)

            this.pc
              .setRemoteDescription(anwser)
              .then(() => {
                debug.log(this.TAG, 'set remote sucess')
              })
              .catch(e => {
                debug.error(this.TAG, e)
              })
          })
        })
      })
      .catch(e => {
        debug.error(this.TAG, e)
      })
  }

  start() {
    let videoConstraints: boolean | VideoTrackConstraints = false
    let audioConstraints: boolean | AudioTrackConstraints = false

    if (this.options.useCamera) {
      if (this.options.videoEnable) videoConstraints = new Base.VideoTrackConstraints(Base.VideoSourceInfo.CAMERA)
      if (this.options.audioEnable) audioConstraints = new Base.AudioTrackConstraints(Base.AudioSourceInfo.MIC)
    } else {
      if (this.options.videoEnable) {
        videoConstraints = new Base.VideoTrackConstraints(Base.VideoSourceInfo.SCREENCAST)
        if (this.options.audioEnable) audioConstraints = new Base.AudioTrackConstraints(Base.AudioSourceInfo.SCREENCAST)
      } else {
        if (this.options.audioEnable) audioConstraints = new Base.AudioTrackConstraints(Base.AudioSourceInfo.MIC)
        else {
          // error shared display media not only audio
          debug.error(this.TAG, 'error paramter')
        }
      }
    }

    if (this.options.resolution.w != 0 && this.options.resolution.h != 0 && typeof videoConstraints == 'object') {
      videoConstraints.resolution = new Base.Resolution(this.options.resolution.w, this.options.resolution.h)
    }

    Base.MediaStreamFactory.createMediaStream(
      new Base.StreamConstraints(audioConstraints as boolean, videoConstraints as boolean)
    )
      .then(stream => {
        this._localStream = stream

        this.dispatch(Events.WEBRTC_ON_LOCAL_STREAM, stream)

        const AudioTransceiverInit: RTCRtpTransceiverInit = {
          direction: 'sendrecv',
          sendEncodings: []
        }
        const VideoTransceiverInit: RTCRtpTransceiverInit = {
          direction: 'sendrecv',
          sendEncodings: []
        }

        if (this.options.simulcast && stream.getVideoTracks().length > 0) {
          VideoTransceiverInit.sendEncodings = [
            { rid: 'h', active: true, maxBitrate: 1000000 },
            { rid: 'm', active: true, maxBitrate: 500000, scaleResolutionDownBy: 2 },
            { rid: 'l', active: true, maxBitrate: 200000, scaleResolutionDownBy: 4 }
          ]
        }
        let audioTransceiver = null
        let videoTransceiver = null
        if (this.options.audioEnable) {
          if (stream.getAudioTracks().length > 0) {
            audioTransceiver = this.pc.addTransceiver(stream.getAudioTracks()[0], AudioTransceiverInit)
          } else {
            AudioTransceiverInit.direction = 'recvonly'
            audioTransceiver = this.pc.addTransceiver('audio', AudioTransceiverInit)
          }
        }

        if (this.options.videoEnable) {
          if (stream.getVideoTracks().length > 0) {
            videoTransceiver = this.pc.addTransceiver(stream.getVideoTracks()[0], VideoTransceiverInit)
          } else {
            VideoTransceiverInit.direction = 'recvonly'
            videoTransceiver = this.pc.addTransceiver('video', VideoTransceiverInit)
          }
        }

        /*
                stream.getTracks().forEach((track,idx)=>{
                    debug.log(this.TAG,track);
                    this.pc.addTrack(track);
                });
                */
        this.pc
          .createOffer()
          .then(desc => {
            debug.log(this.TAG, 'offer:', desc.sdp)
            this.pc.setLocalDescription(desc).then(() => {
              axios({
                method: 'post',
                url: this.options.zlmsdpUrl,
                responseType: 'json',
                data: desc.sdp,
                headers: {
                  'Content-Type': 'text/plain;charset=utf-8'
                }
              }).then(response => {
                const ret = response.data //JSON.parse(response.data);
                if (ret.code != 0) {
                  // mean failed for offer/anwser exchange
                  this.dispatch(Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, ret)
                  return
                }
                const anwser: any = {}
                anwser.sdp = ret.sdp
                anwser.type = 'answer'
                debug.log(this.TAG, 'answer:', ret.sdp)

                this.pc
                  .setRemoteDescription(anwser)
                  .then(() => {
                    debug.log(this.TAG, 'set remote sucess')
                  })
                  .catch(e => {
                    debug.error(this.TAG, e)
                  })
              })
            })
          })
          .catch(e => {
            debug.error(this.TAG, e)
          })
      })
      .catch(e => {
        this.dispatch(Events.CAPTURE_STREAM_FAILED)
        //debug.error(this.TAG,e);
      })

    //const offerOptions = {};
    /*
        if (typeof this.pc.addTransceiver === 'function') {
            // |direction| seems not working on Safari.
            this.pc.addTransceiver('audio', { direction: 'recvonly' });
            this.pc.addTransceiver('video', { direction: 'recvonly' });
        } else {
            offerOptions.offerToReceiveAudio = true;
            offerOptions.offerToReceiveVideo = true;
        }
        */
  }
  _onIceCandidate(event) {
    if (event.candidate) {
      debug.log('Remote ICE candidate: \n ' + event.candidate.candidate)
      // Send the candidate to the remote peer
    } else {
      // All ICE candidates have been sent
    }
  }

  _onTrack(event) {
    if (this.options.element && event.streams && event.streams.length > 0) {
      this.options.element.srcObject = event.streams[0]
      this._remoteStream = event.streams[0]

      this.dispatch(Events.WEBRTC_ON_REMOTE_STREAMS, event)
    } else {
      debug.error('element pararm is failed')
    }
  }

  _onIceCandidateError(event) {
    this.dispatch(Events.WEBRTC_ICE_CANDIDATE_ERROR, event)
  }

  _onconnectionstatechange(event) {
    this.dispatch(Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, this.pc.connectionState)
  }

  _onDataChannelOpen(event) {
    debug.log(this.TAG, 'ondatachannel open:', event)
    this.dispatch(Events.WEBRTC_ON_DATA_CHANNEL_OPEN, event)
  }
  _onDataChannelMsg(event) {
    debug.log(this.TAG, 'ondatachannel msg:', event)
    this.dispatch(Events.WEBRTC_ON_DATA_CHANNEL_MSG, event)
  }
  _onDataChannelErr(event) {
    debug.log(this.TAG, 'ondatachannel err:', event)
    this.dispatch(Events.WEBRTC_ON_DATA_CHANNEL_ERR, event)
  }
  _onDataChannelClose(event) {
    debug.log(this.TAG, 'ondatachannel close:', event)
    this.dispatch(Events.WEBRTC_ON_DATA_CHANNEL_CLOSE, event)
  }
  sendMsg(data) {
    if (this.datachannel != null) {
      this.datachannel.send(data)
    } else {
      debug.error(this.TAG, 'data channel is null')
    }
  }
  closeDataChannel() {
    if (this.datachannel) {
      this.datachannel.close()
      this.datachannel = null
    }
  }
  close() {
    this.closeDataChannel()
    if (this.pc) {
      this.pc.close()
      this.pc = null
    }

    if (this.options) {
      this.options = null
    }

    if (this._localStream) {
      this._localStream.getTracks().forEach((track, idx) => {
        track.stop()
      })
    }

    if (this._remoteStream) {
      this._remoteStream.getTracks().forEach((track, idx) => {
        track.stop()
      })
    }
  }

  get remoteStream() {
    return this._remoteStream
  }

  get localStream() {
    return this._localStream
  }
}
