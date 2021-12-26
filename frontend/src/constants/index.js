export const NUMBER_OF_MEME_CHOICES = 10
export const USERNAME_LENGTH = 20

export const SCENES = {
  intro: 'intro',
  join: 'join',
  host: 'host',
  selection: 'selection',
  caption: 'caption',
  voting: 'voting',
  results: 'results',
  waiting: 'waiting',
}

export const STATES = {
  waiting: 'waiting',
  captioning: 'captioning',
  voting: 'voting',
  results: 'results',
}

export const STATES_TO_SCENES = {
  waiting: 'waiting',
  captioning: 'selection',
  voting: 'voting',
  results: 'results',
}
