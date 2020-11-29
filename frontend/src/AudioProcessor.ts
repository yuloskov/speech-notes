export default () => {
  const chunks: any = [];
  let mediaRecorder: any;
  return {
    start: (onFinish: (file: Blob) => void) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        // @ts-ignore
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.addEventListener("dataavailable", (event: any) => {
          chunks.push(event.data);
          if (mediaRecorder.state == 'inactive') {
            // convert stream data chunks to a 'webm' audio format as a blob
            const audioBlob = new Blob(chunks, { type: 'audio/x-wav' });
            //const audioUrl = URL.createObjectURL(audioBlob);
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
