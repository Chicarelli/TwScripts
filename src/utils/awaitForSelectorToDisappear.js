export const awaitForSelectorToDisappear = async(selector, secondsWaiting = 8) => {
  return new Promise((resolve, reject) => {
    let seconds = 0;

    let timer = setInterval(() => {

      let element = document.querySelector(selector);
      if (!element){
        clearInterval(timer)
        resolve();
      }

      if (seconds > secondsWaiting) {
        clearInterval(timer);
        reject();  
      }

      seconds++;
    }, 1000)
  })
}