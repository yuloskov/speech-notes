import React from 'react';
import {Card} from 'antd';
import {NotePropsT} from '../types';

export default function Note({note, editNode}: NotePropsT) {
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