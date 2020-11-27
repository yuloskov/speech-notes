export interface NoteT {
	id: number,
	datetime: string,
	title: string,
	text: string,
	// TODO add audio fields
}

export interface NotePropsT {
	note: NoteT,
	editNode: (id: number) => void,
}

export interface UserT {
	username: string,
	password: string,
}

export interface NoteDialogPropsT {
	show: boolean,
	close: () => void,
	update: () => Promise<void>,
	id: number,
}