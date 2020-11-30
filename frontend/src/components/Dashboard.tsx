import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Row} from 'antd';
import Note from './Note';
import {PlusOutlined} from '@ant-design/icons';
import NoteDialog from './NoteDialog';
import ApiClient from '../ApiClient';
import {NoteT, NotePropsT} from '../types';

function DashboardItem(props: NotePropsT) {
  return (
    <Col span={6}><Note {...props}/></Col>
  );
}

function DashboardRow({notes, editNode}: {notes: NoteT[], editNode: (id: number) => void}) {
  const items = notes.map(note =>
    <DashboardItem note={note} key={note.id} onClick={editNode}/>
  );
  return (
    <Row gutter={[16, 16]}>
      {items}
    </Row>
  );
}

export default function Dashboard() {
  const [{ visible, id: curId }, setCurNote] = useState({
    visible: false,
    id: -1
  });
  const [notes, setNotes] = useState([] as NoteT[]);

  async function updateNotes() {
    const resp = await ApiClient.get('notes/');
    setNotes(resp.data);
  }

  function getRows() {
    const notesInRows: NoteT[][] = [];

    let index = 0;
    while (index < notes.length) {
      notesInRows.push(notes.slice(index, index + 4));
      index += 4;
    }

    const editNote = (id: number) => setCurNote({ visible: true, id });
    return notesInRows.map(rowNotes =>
      <DashboardRow notes={rowNotes} key={rowNotes[0].id} editNode={editNote}/>
    );
  }

  useEffect(() => {
    updateNotes();
  }, []);

  return (
    <>
      {visible && <NoteDialog
        close={() => setCurNote({ visible: false, id: -1 })}
        update={updateNotes}
        id={curId}
      />}
      <Card bordered={false}>
        <Row justify='end'>
          <Button type='primary' shape='circle' onClick={() => setCurNote({ visible: true, id: -1 })}>
            <PlusOutlined/>
          </Button>
        </Row>
        <p/>
        {getRows()}
      </Card>
    </>
  );
}
