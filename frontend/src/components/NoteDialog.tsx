import { Button, Col, Modal, Row, Tag } from 'antd'
import {Input} from 'antd';
import React, { useEffect, useState } from 'react'
import { AudioOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'
import ApiClient from '../ApiClient';
import makeRecorder from '../AudioProcessor';
import { NoteDialogPropsT, NoteT, NoteOpE } from '../types';

const {TextArea} = Input;

export default function NoteDialog({id, close, update}: NoteDialogPropsT) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [created, setCreated] = useState<Date>(new Date(0));
  const [audio, setAudio] = useState<Blob | string | null>(null);
  const [time, setTime] = useState(0);
  const [recording, setRecording] = useState(false);
  const operation: NoteOpE = id > -1 ? NoteOpE.EDIT : NoteOpE.ADD;

  useEffect(() => {
    if (id === -1) return;

    ApiClient.get(`notes/${id}/`).then(({data}: {data: NoteT}) => {
      setText(data.text);
      setTitle(data.title);
      setAudio(data.audio_file);
      setCreated(new Date(data.datetime));
    });
  }, [id]);

  async function submit() {
    if (title === '' && text === '') {
      close();
      return;
    }

    if (id === -1) {
      const data = new FormData();
      data.append('title', title);
      data.append('text', text);
      if (audio !== null) {
        data.append('audio_file', audio as Blob, 'audio.wav');
      }
      await ApiClient.post('notes/', data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
    } else {
      await ApiClient.patch(`notes/${id}/`, { title, text });
    }

    update();
    close();
  }

  async function deleteNote() {
    await ApiClient.delete(`notes/${id}/`);
    update();
    close();
  }

  useEffect(() => {
    if (!recording) return;

    const recorder = makeRecorder();
    const intervalId = setInterval(() => setTime((time) => time + 1), 1000)
    recorder.start((file: Blob) => setAudio(file));

    return () => {
      clearInterval(intervalId)
      recorder.stop()
    };
  }, [recording]);

  return (
    <Modal
      title={operation}
      visible
      onOk={submit}
      onCancel={close}
      footer={
        <Row>
          <Col flex={0}>
            {id === -1 ? (<>
              <Button onClick={() => setRecording(!recording)} shape='circle' style={{ marginRight: 8 }}>
                <AudioOutlined/>
              </Button>
              {(recording || audio) && <Tag
                icon={recording ? <SyncOutlined spin /> : <CheckCircleOutlined />}
                color={recording ? "processing" : "success"}>
                  {recording ? "recording... " : "done "}
                  {(time / 60).toFixed(0).padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}
              </Tag>}
            </>) : (
              <Button onClick={deleteNote} type="primary" danger style={{ marginRight: 8 }}>
                Delete
              </Button>
            )}
          </Col>
          <Col flex={24}>
            <Button key='back' onClick={close}>
              Cancel
            </Button>
            <Button key='submit' type='primary' onClick={submit}>
              {operation}
            </Button>
          </Col>
        </Row>
      }
    >
      {operation === NoteOpE.EDIT && <h2>{created.toDateString()}</h2>}
      <TextArea
        key='title'
        rows={1}
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        placeholder='Enter title here'
      />
      <p/>
      <TextArea
        key='text'
        rows={4}
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder='Enter your note here'
      />
      {id > -1 && audio && <figure>
        <figcaption>Listen your note:</figcaption>
          <audio
            controls
            src={audio as string}>
            Your browser does not support the
            <code>audio</code> element.
          </audio>
      </figure>}
    </Modal>
  );
}
