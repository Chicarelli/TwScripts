export const awaitForSelector = async(selector, secondsWaiting = 7) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)){
      resolve(document.querySelector(selector));
    }

    let seconds = 0;

    let timer = setInterval(() => {

      let element = document.querySelector(selector);
      if (element){
        clearInterval(timer)
        resolve(element);
      }

      if (seconds > (secondsWaiting * 5)) {
        clearInterval(timer);
        reject();  
      }

      seconds++;
    }, 200)
  })
}