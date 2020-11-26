import React, { useState, useEffect } from 'react';
import {Button, Card, Col, Row} from 'antd';
import Note from './Note';
import {PlusOutlined} from '@ant-design/icons';
import AddNote from './AddNote';
import ApiClient, { setToken } from '../ApiClient';


export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState([]);

  async function updateNotes() {
    const resp = await ApiClient.get('notes/')
    setNotes(resp.data)
    console.log(notes)
  }
  useEffect(() => {
    updateNotes()
  }, [])
  return (
    <div>
      <AddNote show={visible} close={() => setVisible(false)}/>
      <Card bordered={false}>
        <Row justify='end'>
          <Button type='primary' shape='circle' onClick={() => setVisible(true)}>
            <PlusOutlined/>
          </Button>
        </Row>
        <p/>
        <Row gutter={[16, 16]}>
          <Col span={6}><Note/></Col>
          <Col span={6}><Note/></Col>
          <Col span={6}><Note/></Col>
          <Col span={6}><Note/></Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}><Note/></Col>
          <Col span={6}><Note/></Col>
          <Col span={6}><Note/></Col>
          <Col span={6}><Note/></Col>
        </Row>
      </Card>
    </div>
  );
}