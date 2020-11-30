export default function AudioProcessor() {
  const chunks: Blob[] = [];
  let mediaRecorder: MediaRecorder;
  return {
    start: (onFinish: (file: Blob) => void) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.addEventListener("dataavailable", event => {
          chunks.push(event.data);
          if (mediaRecorder.state === 'inactive') {
            // convert stream data chunks to a 'webm' audio format as a blob
            const audioBlob = new Blob(chunks, { type: 'audio/x-wav' });
            onFinish(audioBlob);
          }
        })
        mediaRecorder.start(500);
      })
    },
    stop: () => {
      mediaRecorder.stop();
    }
  }
}
