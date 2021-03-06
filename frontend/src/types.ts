export interface NoteT {
	id: number,
	datetime: string,
	title: string,
	text: string,
	audio_file: string,
}

export interface NotePropsT {
	note: NoteT,
	onClick: (id: number) => void,
}

export interface UserT {
	username: string,
	password: string,
}

export interface NoteDialogPropsT {
	close: () => void,
	update: () => Promise<void>,
	id: number,
}

export enum NoteOpE {
	ADD = 'Add Note',
	EDIT = 'Edit Note',
}
