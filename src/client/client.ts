import { play, newMovie, next, destroyMovie } from './movie'
import newScene1 from './scenes/scene1'
import newScene2 from './scenes/scene2'

const content = document.getElementById("text-content")

newMovie(content as HTMLElement, newScene1(), newScene2())
.then(m => {
  const unloadListener = () => {
    destroyMovie(m)
    window.removeEventListener("beforeunload", unloadListener);
  };

  window.addEventListener("beforeunload", unloadListener);


  const nextButton = document.getElementById("next")


  if (nextButton && content) {
    nextButton.onclick = async () => await next(m, content) 
  }

  return m
})
.then(m => {play(m); return m })
// .then(destroyMovie)

