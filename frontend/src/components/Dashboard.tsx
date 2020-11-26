import React, {useState} from 'react';
import {Button, Card, Col, Row} from 'antd';
import Note from './Note';
import {PlusOutlined} from '@ant-design/icons';
import AddNote from './AddNote';


export default function Dashboard() {
  const [visible, setVisible] = useState(false);

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