import React from 'react';
import { Card } from 'antd';
import { NotePropsT } from '../types';

export default function Note({note, onClick}: NotePropsT) {
  return (
    <Card
      onClick={() => onClick(note.id)}
      hoverable
      title={note.title}
    >
      <p style={{overflowWrap: 'break-word'}}>
        {note.text}
      </p>
    </Card>
  );
}
