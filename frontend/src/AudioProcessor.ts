// @ts-nocheck
import Recorder from 'recorder-js';
export default function AudioProcessor() {
  let recorder: Recorder;
  const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
  return {
    start: () => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        recorder = new Recorder(audioContext, {
          onAnalysed: data => console.log(data),
        });
        recorder.init(stream);
        recorder.start();
      })
    },
    stop: (onFinish: (file: Blob) => void) => {
        recorder.stop().then(({blob, buffer}) => {
        onFinish(blob);
      });
    }
  }
}
