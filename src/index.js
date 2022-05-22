import { executeFarmScreen } from './controllers/farmScreen';

const location = window.location.href;

if (location.indexOf("screen=am_farm") >= 0) {
  try {
    executeFarmScreen();
  }
  catch(error) {
    console.log(error);
    window.location.reload();
  }
}