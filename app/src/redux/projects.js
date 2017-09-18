const TEST = 'beam/projects/TEST'

const initialState = {
  currentData: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TEST:
      return { ...state }

    default:
      return state
  }
}

export function test() {
  return {
    type: TEST
  }
}
