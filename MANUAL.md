# Dezoofier - User Manual

## Overview
Dezoofier is a search engine that, given available and sought information types,
offers possible sequences of OSINT tools to use.

## Glossary
* **Entity**: A type of information. Examples: name, location, twitter account,
  aircraft registration number, ...
* **Service**: A website (or command-line tool) that can associate some entities
  to others. Examples: [Flightradar24](https://www.flightradar24.com/) can
  associate an aircraft or a flight to its location,
  [EPIEOS](https://epieos.com/) can associate a gmail address to social media
  accounts, ...
* **Path**: A path is a list of 2 or more services that can be used in a
  sequence to obtain an entity. Example: Having a Google email and looking for
  an image of its owner, one can look it up in [EPIEOS](https://epieos.com/),
  obtain its owner's name, then enter it in
  [Twitter's advanced search](https://twitter.com/search-advanced) and get the
  actual picture from the account's avatar or tweets.

## Recommendations and tips
An intuitive but important observation: the shorter the path, the better.
Try suggestions from the `Direct services` section before moving to more complex
paths, as these are less likely to give you accurate results.

If you need to simply "widen" the information you have, try leaving
the `Sought entities` field blank. This will return all direct services that
have any of the given `Known entities` as input.\
Alternatively, you can search for vague entities like `statistics`, `account`
or `text`.

However, although some services may take `statistics`, `account` or `text` as
input, it is usually best to avoid using abstract entities in the input.
The `Known entities` field should be as precise as possible.\
Examples: ~~statistics~~ `dob`, ~~account~~ `discord-account`, ~~text~~
`webpage`
