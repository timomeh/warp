import * as storybook from '@storybook/react'

import '../src/index.css'

const req = require.context('../src/components', true, /\.js$/)

function loadStories() {
  req.keys().forEach((filename) => {
    const mod = req(filename)
    if (mod.stories) return mod.stories(storybook)
  })
}

storybook.configure(loadStories, module)
