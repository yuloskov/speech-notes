import React from 'react';
import {Card} from 'antd';

export default function Note(props: any) {
  return (
    <Card hoverable title={props.title}>
      {props.text}
    </Card>
  );
}