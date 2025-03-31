import { play, newMovie } from './movie'
import newScene1 from './scenes/scene1'


newMovie(newScene1())
.then(play)