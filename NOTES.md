Notes
=====


Features

* group chat
* feedback message
* question and answer
* change log
* mail forwarding of messages
* screenshot
* chat bot



## TODO Items


### Configuration

* configurable mongo url
* configurable chat setup: group chat, q&a, change log, question only, messaging
* integration w third party services

### Discussions

* finish the screenshot tool
* limit the number of messages returned by each query
* batched, backward navigation through message history
* emojis

### Q&A

* alternate discussion cards left/right orientation
* for the near term, map the user id to a color and render it to the
  avatar
* nest answers inside the question card
* question icon


## Change Log

* collapsible change log entries


### Authentication Integration

* client sends through cookies w request headers, backend authenticates against user endpoint

### Chat Bot

The chat bot interface would provide access to help for end users and to administrative functions for admin users.

* vertical 3 dot menu in footer for admin ... OR command language
* chat bot command language
* commands /q for question, /help, /h
