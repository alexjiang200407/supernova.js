import { play, newMovie, next, destroyMovie } from './movie'
import newScene1 from './scenes/scene1'
import newScene2 from './scenes/scene2';
import newScene3 from './scenes/scene3';

const content = document.getElementById("text-content")

newMovie(content as HTMLElement, newScene1(), newScene2(), newScene3())
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
      scrollbar.scrollTop = scrollbar.scrollHeight;
    } 
  }

  return m
})
.then(m => {play(m); return m })
// .then(destroyMovie)

