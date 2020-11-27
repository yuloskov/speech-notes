import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Row} from 'antd';
import Note from './Note';
import {PlusOutlined} from '@ant-design/icons';
import AddNote from './AddNote';
import ApiClient from '../ApiClient';

function DashboardItem({note}: any) {
  return (
    <Col span={6}><Note  title={note.title} text={note.text}/></Col>
  )
}

function DashboardRow({notes}: any) {
  const items = notes.map((note: any) =>
    <DashboardItem note={note}/>
  );
  return (
    <Row gutter={[16, 16]}>
      {items}
    </Row>
  )
}

export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState([]);

  async function updateNotes() {
    const resp = await ApiClient.get('notes/')
    setNotes(resp.data)
  }

  function getRows() {
    const notesInRows = []

    let row: any[] = []

    let i = 0;
    for (let note of notes) {
      i += 1;
      row.push(note)

      if (i % 4 === 0 || (i === notes.length && row.length > 0)) {
        notesInRows.push(row)
        row = [];
      }
    }

    const rows = notesInRows.map((rowNotes) =>
      <DashboardRow notes={rowNotes}/>
    );
    return rows;
  }

  useEffect(() => {
    updateNotes()
  }, [])

  const rows = getRows();

  return (
    <div>
      <AddNote show={visible} close={() => setVisible(false)} update={updateNotes}/>
      <Card bordered={false}>
        <Row justify='end'>
          <Button type='primary' shape='circle' onClick={() => setVisible(true)}>
            <PlusOutlined/>
          </Button>
        </Row>
        <p/>
        {rows}
      </Card>
    </div>
  );
}