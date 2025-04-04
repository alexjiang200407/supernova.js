import { getParticleSystem } from './fx/getParticleSystem';
import { play, newMovie, next, destroyMovie } from './movie'
import newScene1 from './scenes/scene1'
import newScene2 from './scenes/scene2';
import newScene3 from './scenes/scene3';
import newScene4 from './scenes/scene4';
import newScene5 from './scenes/scene5';
import { sleep } from './util';

const content = document.getElementById("text-content")

newMovie(content as HTMLElement, newScene1(), newScene2(), newScene3(), newScene4(), newScene5())
.then(m => {
  const unloadListener = () => {
    destroyMovie(m)
    window.removeEventListener("beforeunload", unloadListener);
  };

  window.addEventListener("beforeunload", unloadListener);


  const scrollbar = document.getElementById("collapsible")
  const nextButton = document.getElementById("next")

  if (nextButton && content && scrollbar) {
    nextButton.onclick = async () => {
      await next(m, content)
      scrollbar.scrollTo({behavior: 'smooth', left: 0, top: scrollbar.scrollHeight});
    } 
  }

  const skipTo = async (sceneIdx: number) => {
    if (sceneIdx >= m.scenes.length || sceneIdx < m.sceneIdx || !content) {
      return "Invalid SceneIdx"
    }

    while (m.sceneIdx != sceneIdx) {
      await next(m, content)
      await sleep(300)
    }

    return "Success"
  }
  
  (window as any).skipTo = skipTo;


  return m
})
.then(m => {play(m); return m })
// .then(destroyMovie)



