import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Row} from 'antd';
import Note from './Note';
import {PlusOutlined} from '@ant-design/icons';
import NoteDialog from './NoteDialog';
import ApiClient from '../ApiClient';

function DashboardItem({note, editNode}: any) {
  return (
    <Col span={6}><Note note={note} editNode={editNode}/></Col>
  );
}

function DashboardRow({notes, editNode}: any) {
  const items = notes.map((note: any) =>
    <DashboardItem note={note} editNode={editNode}/>
  );
  return (
    <Row gutter={[16, 16]}>
      {items}
    </Row>
  );
}

export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [curId, setCurId] = useState('');

  async function updateNotes() {
    const resp = await ApiClient.get('notes/');
    setNotes(resp.data);
  }

  function editNode(id: string) {
    setCurId(id);
    setVisible(true);
  }

  function getRows() {
    const notesInRows = [];

    let row: any[] = [];

    let i = 0;
    for (let note of notes) {
      i += 1;
      row.push(note);

      if (i % 4 === 0 || (i === notes.length && row.length > 0)) {
        notesInRows.push(row);
        row = [];
      }
    }

    return notesInRows.map((rowNotes) =>
      <DashboardRow notes={rowNotes} editNode={editNode}/>
    );
  }

  useEffect(() => {
    updateNotes();
  }, []);

  const rows = getRows();

  return (
    <div>
      <NoteDialog
        show={visible}
        close={() => setVisible(false)}
        update={updateNotes}
        id={curId}
      />
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