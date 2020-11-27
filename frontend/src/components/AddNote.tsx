import {Button, Col, Modal, Row} from 'antd';
import {Input} from 'antd';
import React, {useState} from 'react';
import {AudioOutlined} from '@ant-design/icons';
import ApiClient from '../ApiClient';

const {TextArea} = Input;

export default function AddNote(props: any) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  async function handleOk(e: any) {
    if (title === '' && text === '') {
      props.close();
      return
    }

    await ApiClient.post('notes/', {
      title: title,
      text: text,
    });

    props.update();
    props.close();
  }

  function handleCancel(e: any) {
    props.close()
  }


  function recordVoice() {
    console.log('recording...')
  }

  return (
    <Modal
      title='Add Note'
      visible={props.show}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Row>
          <Col flex={0}>
            <Button key='voice' onClick={recordVoice} shape='circle'>
              <AudioOutlined/>
            </Button>
          </Col>
          <Col flex={24}>
            <Button key='back' onClick={handleCancel}>
              Cancel
            </Button>
            <Button key='submit' type='primary' onClick={handleOk}>
              Add note
            </Button>
          </Col>
        </Row>
      ]}
    >
      <TextArea
        key='title'
        rows={1}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Enter title here'
      />
      <p/>
      <TextArea
        key='text'
        rows={4}
        onChange={(e) => setText(e.target.value)}
        placeholder='Enter your note here'
      />
    </Modal>
  );
}