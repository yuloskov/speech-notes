import {Button, Col, Modal, Row} from 'antd';
import {Input} from 'antd';
import React, {useState} from 'react';
import {AudioOutlined} from '@ant-design/icons';
import ApiClient from '../ApiClient';
import {NoteDialogPropsT} from '../types';

const {TextArea} = Input;
const editOp = 'Edit Note';
const addOp = 'Add Note';


export default function NoteDialog({id, close, show, update}: NoteDialogPropsT) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState(addOp);

  async function getCurNote() {
    if (id === -1) return;

    const resp = await ApiClient.get(`notes/${id}/`);
    setText(resp.data.text);
    setTitle(resp.data.title);
  }

  async function submit() {
    if (title === '' && text === '') {
      close();
      return;
    }

    if (operation === addOp) {
      await ApiClient.post('notes/', {title,text});
    } else if (id !== -1) {
      await ApiClient.patch(`notes/${id}/`, {title, text});
    }

    setOperation(addOp);
    update();
    close();
  }

  function cancel() {
    setOperation(addOp);
    close();
  }

  function recordVoice() {
    console.log(operation);
    console.log('recording...');
  }

  if (show && operation === addOp && id !== -1) {
    setOperation(editOp);
    getCurNote();
  }

  return (
    <Modal
      title={operation}
      visible={show}
      onOk={submit}
      onCancel={cancel}
      footer={
        <Row>
          <Col flex={0}>
            <Button key='voice' onClick={recordVoice} shape='circle'>
              <AudioOutlined/>
            </Button>
          </Col>
          <Col flex={24}>
            <Button key='back' onClick={cancel}>
              Cancel
            </Button>
            <Button key='submit' type='primary' onClick={submit}>
              {operation}
            </Button>
          </Col>
        </Row>
      }
    >
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
    </Modal>
  );
}
