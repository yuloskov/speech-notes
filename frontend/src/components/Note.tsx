import React from 'react';
import {Card} from 'antd';

export default function Note({note, editNode}: any) {
  return (
    <div onClick={() => editNode(note.id)}>
      <Card
        hoverable
        title={note.title}
      >
        {note.text}
      </Card>
    </div>
  );
}