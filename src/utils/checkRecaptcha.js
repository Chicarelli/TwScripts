import {delay} from './delay';

export async function checkRecaptcha() {
  await delay(1000);

  const recaptcha = document.querySelector("#checkbox");
  if (!recaptcha)  {
    return;
  }

  recaptcha.click();

  await delay(2000);

  if (document.querySelector("#checkbox")) {
    const audioElement = document.createElement("audio");
      audioElement.src = "https://audio-previews.elements.envatousercontent.com/files/181619625/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22FM9B3TC-alarm.mp3%22";

      audioElement.muted = "muted";

      audioElement.play();

  }

}