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
  const [notes, setNotes] = useState([] as NoteT[]);
  const [curId, setCurId] = useState(-1);

  async function updateNotes() {
    const resp = await ApiClient.get('notes/');
    setNotes(resp.data);
  }

  function editNode(id: number) {
    setCurId(id);
    setVisible(true);
  }

  function getRows() {
    const notesInRows: NoteT[][] = [];

    let index = 0;
    while (index < notes.length) {
      notesInRows.push(notes.slice(index, index + 4));
      index += 4;
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
    <>
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
    </>
  );
}