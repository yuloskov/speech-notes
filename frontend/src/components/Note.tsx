import React from 'react';
import {Card} from 'antd';
import {NotePropsT} from '../types';

export default function Note({note, onClick}: NotePropsT) {
  return (
    <div onClick={() => onClick(note.id)}>
      <Card
        hoverable
        title={note.title}
      >
        {note.text}
      </Card>
    </div>
  );
}
