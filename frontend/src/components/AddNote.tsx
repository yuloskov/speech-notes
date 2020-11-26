import {Button, Col, Modal, Row} from 'antd';
import {Input} from 'antd';
import React from 'react';
import {AudioOutlined} from '@ant-design/icons';

const {TextArea} = Input;

export default function AddNote(props: any) {
  function handleOk(e: any) {
    console.log(e);
    props.close();
  }

  function handleCancel(e: any) {
    console.log(e);
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
        <>
          <Row>
            <Col flex={0}>
              <Button key='voice' onClick={recordVoice} shape='circle'>
                <AudioOutlined />
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
        </>
      ]}
    >
      <TextArea rows={4}/>
    </Modal>
  );
}