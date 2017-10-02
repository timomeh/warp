const utils = {
  parseRef(ref) {
    const refRegex = /refs\/(heads|tags)\/(.*)/
    const result = refRegex.exec(ref)

    switch (result[1]) {
      case 'heads': return ['branch', result[2], 'Branch']
      case 'tags': return ['tag', result[2], 'Tag']
      default: return ['?', result[2]]
    }
  }
}

export default utils
