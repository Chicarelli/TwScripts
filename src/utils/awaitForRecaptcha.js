export const awaitForRecaptcha = (secondsWaiting = 40) => {
  return new Promise((resolve, reject) => {
    let seconds = 0;

    let timer = setInterval(() => {

      let iframe = document.querySelector("#bot_check");
      if (iframe) {
      }

      if (iframe){
        clearInterval(timer)
        resolve(iframe);
      }

      if (seconds > secondsWaiting) {
        clearInterval(timer);
        reject();  
      }

      seconds++;
    }, 1000)
  })
}