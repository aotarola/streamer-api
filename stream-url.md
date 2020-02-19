# Offload URL to remote

Allow the Authenticated request to post a `url` that will be
streamed over a remote server

**URL** : `/stream-url`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

```json
{
    "url": "[any length, required]",
}
```

## Success Responses

**Condition** : Data provided is valid and request is Authenticated.

**Code** : `201`

## Error Responses

**Condition** : If provided data is invalid, e.g. `url` is not present in the payload

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
  "statusCode":400,
  "error":"Bad Request",
  "message":"Invalid request payload input"
}
```

