export const delay = (time = 300) => new Promise((resolve, reject) =>{
  setTimeout(() => {
    resolve();
  }, time);
})