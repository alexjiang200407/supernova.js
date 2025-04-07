import { destroyMovie, newMovie, next, play } from './movie'
import newScene1 from './scenes/scene1'
import newScene2 from './scenes/scene2'
import newScene3 from './scenes/scene3'
import newScene4 from './scenes/scene4'
import newScene5 from './scenes/scene5'
import newScene6 from './scenes/scene6'
import newScene7 from './scenes/scene7'
import newScene8 from './scenes/scene8'
import newScene9 from './scenes/scene9'
import { sleep } from './util'

const content = document.getElementById('text-content')

newMovie(content as HTMLElement, newScene1(), newScene2(), newScene3(), newScene4(), newScene5(), newScene6(), newScene7(), newScene8(), newScene9())
  .then((m) => {
    const unloadListener = () => {
      destroyMovie(m)
      window.removeEventListener('beforeunload', unloadListener)
    }

    window.addEventListener('beforeunload', unloadListener)

    const scrollbar = document.getElementById('collapsible')
    const nextButton = document.getElementById('next')

    if (nextButton && content && scrollbar) {
      nextButton.onclick = async () => {
        const hasNext = await next(m, content)
        if (!hasNext) {
          content.innerHTML = `<h1 class='title'>The End!</h1><p>This is the end of my APOD. Thank you and have a good day!</p>`
          nextButton.parentElement.removeChild(nextButton)
        }
        scrollbar.scrollTo({ behavior: 'smooth', left: 0, top: scrollbar.scrollHeight })
      }
    }

    const skipTo = async (sceneIdx: number) => {
      if (sceneIdx >= m.scenes.length || sceneIdx < m.sceneIdx || !content) {
        return 'Invalid SceneIdx'
      }

      while (m.sceneIdx !== sceneIdx) {
        await next(m, content)
        await sleep(300)
      }

      return 'Success'
    }

    (window as any).skipTo = skipTo

    return m
  })
  .then(play)
