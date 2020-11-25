# Backend for speech-notes

## Auth

#### User registration

`POST` `/auth/register/` 

Example request:

```json
{
    "username": "foobar",
    "email": "foo@bar.xyz",
    "password": "TopSecret123"
}
```

Example response:

```json
{
    "username": "foobar",
    "email": "foo@bar.xyz",
    "password": "TopSecret123",
    "token": "1d1ca3cb40d6a28615cfeda43e69ac110a3ca0dd"
}
```

#### User login

`POST` `/auth/login/`

Example request:

```json
{
    "username": "foobar",
    "password": "TopSecret123"
}
```

Example response:

```json
{
    "token": "1d1ca3cb40d6a28615cfeda43e69ac110a3ca0dd"
}
```

All subsequent requests should be sent along with header `Authorization: Token <token>`

## Notes


#### Create a note

`POST` `/notes/`

- Create a note without audio (text only)

Request:
```json
{
    "title": "Cool note",
    "text": "Sample text",
}
```

Response:
```json
{
    "id": 23,
    "datetime": "2020-11-25T14:54:42.179184Z",
    "title": "Cool note",
    "text": "Sample text",
    "audio_file": null,
    "audio_processing_status": null
}
```

- Create a note with audio

Request:
```json
{
    "title": "Cool note",
    "audio_file": File("file.mp3"),
}
```

Response:
```json
{
    "id": 12,
    "datetime": "2020-11-25T14:43:23.740918Z",
    "title": "Cool note",
    "text": null,
    "audio_file": "http://localhost:8000/uploaded-audio-files/file.mp3",
    "audio_processing_status": 1
}
```

`audio_processing_status` can be 0, 1 and 2.

0 - OK (meaning that audio file is processed correctly and `text` field is usable)

1 - PENDING (request to STT service is sent, but the result is not accessible yet)

2 - ERROR (some error happened while processing the audio, `text` field is unusable)

The audio file content is available via `audio_file` URL using `GET` request.

#### Get user's notes

`GET` `/notes/`

Example response:
```json
[
    {
        "id": 1,
        "datetime": "2020-11-25T14:44:09.840343Z",
        "title": "lol",
        "text": null,
        "audio_file": "http://localhost:8000/uploaded-audio-files/file.mp3",
        "audio_processing_status": 1
    },
    {
        "id": 3,
        "datetime": "2020-11-25T14:47:57.411721Z",
        "title": "hey",
        "text": "hello world",
        "audio_file": null,
        "audio_processing_status": null
    },
    ...
]
```

#### Get specific note
`GET` `/notes/<id>/`

Example response:

```json
{
    "id": <id>,
    "datetime": "2020-11-25T14:47:57.411721Z",
    "title": "hey",
    "text": "hello world",
    "audio_file": null,
    "audio_processing_status": null
}
```

#### Update a note

`PUT/PATCH` `/notes/<id>/`

```json
{
    "title": "New title",
    "audio_file": File("other_file.mp3"),
}
```

#### Delete a note
`DELETE` `/notes/<id>/`

Response: HTTP 204 No Content