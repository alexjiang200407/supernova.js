import { play, newMovie, nextScene, destroyMovie } from './movie'
import newScene1 from './scenes/scene1'
import newScene2 from './scenes/scene2'

newMovie(newScene1(), newScene2(), newScene2())
.then(m => {
  const unloadListener = () => {
    destroyMovie(m)
    window.removeEventListener("beforeunload", unloadListener);
  };

  window.addEventListener("beforeunload", unloadListener);


  const nextButton = document.getElementById("next")

  if (nextButton) {
    nextButton.onclick = () => nextScene(m) 
  }

  return m
})
.then(m => {play(m); return m })
// .then(destroyMovie)

