import fs from 'fs'
import path from 'path'

const toolsDirectory = path.join(process.cwd(), 'pages/tools')

export function getTools() {
  const fileNames = fs.readdirSync(toolsDirectory)

  const toolsData = fileNames.map(fileName => {
    let id = fileName.replace(/\.js$/, '')
    const title = id.charAt(0).toUpperCase() + id.slice(1)
    return  {
      id,
      title
    }
  })
  return toolsData
}
