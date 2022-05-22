export class FarmController {
  _controller = {
    controller: null,
    startButton: null,
  }

  _pause = null;
  _start = null;

  constructor(startFunction, pauseFunction) {
    this._pause = startFunction;
    this._start = pauseFunction;

    const farmScreenContainer = document.createElement('div');
    this._styleContainer(farmScreenContainer);  

    const buttonDiv = document.createElement('div');
    this._styleButtonDiv(buttonDiv);

    const startButton = document.createElement('button');
    this._styleButtonStart(startButton);
    startButton.innerHTML = 'Start';
    startButton.onclick = startFunction;

    buttonDiv.appendChild(startButton)
    farmScreenContainer.appendChild(buttonDiv);

    this._controller = {
      controller: farmScreenContainer,
      startButton: startButton
    }
  }

  getContainer() {
    return this._controller.controller;
  }

  onStart() {
    this._controller.startButton.innerHTML = 'stop';
    this._controller.startButton.onclick = this._start;
  }

  onPause() {
    this._controller.startButton.innerHTML = 'start';
    this._controller.startButton.onclick = this._pause;
  }

  _styleContainer(element) {
    element.style.background = '#DECDA9';
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.width = '320px';
    element.style.border = '1px solid #7d510f'
  }
  
  _styleButtonStart(element) {
    element.style.border = 'none';
    element.style.background = '#c1a264';
    element.style.color = '#111';
    element.style.fontWeight =' bold';
    element.style.padding = '10px 30px';
    element.style.textTransform = 'uppercase';
    element.style.width = '100px';
    element.style.margin = '5px 10px';
    element.style.marginTop = '15px'
  }
  
  _styleButtonDiv(element) {
    element.style.width = '100%';
    element.style.display = 'flex';
    element.style.justifyContent = 'flex-end';
    element.style.paddingRight = '5px';
  }
}