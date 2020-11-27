import {Button, Col, Modal, Row} from 'antd';
import {Input} from 'antd';
import React, {useState} from 'react';
import {AudioOutlined} from '@ant-design/icons';
import ApiClient from '../ApiClient';

const {TextArea} = Input;
const editOp = 'Edit Note';
const addOp = 'Add Note';

export default function NoteDialog(props: any) {
  const [text, setText] = useState(props.text);
  const [title, setTitle] = useState(props.title);
  const [operation, setOperation] = useState(addOp);

  async function getCurNote() {
    if (props.id === '') {
      return;
    }
    const resp = await ApiClient.get(`notes/${props.id}/`);
    setText(resp.data.text);
    setTitle(resp.data.title);
  }

  async function submit(e: any) {
    if (title === '' && text === '') {
      props.close();
      return;
    }

    if (operation === addOp) {
      await ApiClient.post('notes/', {
        title: title,
        text: text,
      });
    } else if (props.id !== '') {
      await ApiClient.patch(`notes/${props.id}/`, {
        title: title,
        text: text,
      });
    }

    setOperation(addOp);
    props.update();
    props.close();
  }

  function cancel(e: any) {
    setOperation(addOp);
    props.close();
  }

  function recordVoice() {
    console.log(operation);
    console.log('recording...');
  }

  if (props.show && operation === addOp && props.id !== '') {
    setOperation(editOp);
    getCurNote();
  }

  return (
    <Modal
      title={operation}
      visible={props.show}
      onOk={submit}
      onCancel={cancel}
      footer={[
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
      ]}
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